from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from datetime import datetime, timedelta
import yfinance as yf

from app.config import settings

SECRET_KEY = settings.JWT_SECRET
ALGORITHM = "HS256"

client = AsyncIOMotorClient(settings.MONGODB_URL)
db = client[settings.DATABASE_NAME]

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# Helper: fetch stock price on a specific date (purchase date)
def get_stock_price_on_date(ticker: str, date_str: str) -> float:
    """Fetch the closing price of the stock near the given purchase date."""
    try:
        date = datetime.strptime(date_str, "%Y-%m-%d").date()

        # Download small window around purchase date
        start = date - timedelta(days=3)
        end = date + timedelta(days=3)

        data = yf.download(ticker, start=start, end=end, progress=False)

        if not data.empty:
            # Get closest available trading day price
            closest_date = data.index[-1]
            price = float(data.loc[closest_date]["Close"])
            return price
        else:
            return 0.0
    except Exception as e:
        print(f"⚠️ Error fetching purchase price for {ticker}: {e}")
        return 0.0


# Helper: fetch current price
def get_current_price(ticker: str) -> float:
    try:
        data = yf.Ticker(ticker)
        price = data.history(period="1d")["Close"].iloc[-1]
        return float(price)
    except Exception as e:
        print(f"⚠️ Error fetching current price for {ticker}: {e}")
        return 0.0


async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")

        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        total_profit = 0.0
        updated_portfolio = []

        for item in user.get("portfolio", []):
            ticker = item["companyId"]
            quantity = item["quantity"]
            purchase_date = item.get("purchaseDate")

            # ✅ Fetch purchase price based on the purchase date
            purchase_price = get_stock_price_on_date(ticker, purchase_date)

            # ✅ Fetch latest price
            current_price = get_current_price(ticker)

            # ✅ Compute profit/loss
            profit_per_share = current_price - purchase_price
            total_item_profit = profit_per_share * quantity
            total_profit += total_item_profit

            # ✅ Get company name
            company = await db.companies.find_one({"ticker": ticker})
            company_name = company["name"] if company else ticker

            updated_portfolio.append({
                **item,
                "purchasePrice": purchase_price,
                "currentPrice": current_price,
                "profitPerShare": profit_per_share,
                "totalProfit": total_item_profit,
                "companyName": company_name
            })

        # ✅ Update in database
        await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"portfolio": updated_portfolio, "profit": total_profit}}
        )

        user["portfolio"] = updated_portfolio
        user["profit"] = total_profit
        user["_id"] = str(user["_id"])

        return user

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
