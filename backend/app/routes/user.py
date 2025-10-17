# app/routes/user.py
from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from app.config import settings
from app.services.userDetails import get_current_user
from app.services.yfinance_helper import get_stock_price_on_date, get_stock_price

router = APIRouter()
client = AsyncIOMotorClient(settings.MONGODB_URL)
db = client[settings.DATABASE_NAME]

@router.put("/user/update")
async def update_user(payload: dict, current_user=Depends(get_current_user)):
    user_id = ObjectId(current_user["_id"])
    username = payload.get("username")
    portfolio = payload.get("portfolio", [])

    if not username:
        raise HTTPException(status_code=400, detail="Username is required")

    total_profit = 0.0
    updated_portfolio = []

    # Process portfolio items
    for item in portfolio:
        ticker = item.get("companyId")
        quantity = item.get("quantity", 0)
        purchase_date = item.get("purchaseDate")

        if not ticker or not purchase_date:
            continue

        # Fetch prices
        purchase_price = get_stock_price_on_date(ticker, purchase_date)
        current_price = get_stock_price(ticker)

        profit_per_share = current_price - purchase_price
        total_item_profit = profit_per_share * quantity
        total_profit += total_item_profit

        # Get company name
        company = await db.companies.find_one({"ticker": ticker})
        company_name = company["name"] if company else ticker

        updated_portfolio.append({
            "companyId": ticker,
            "quantity": quantity,
            "purchaseDate": purchase_date,
            "purchasePrice": purchase_price,
            "currentPrice": current_price,
            "profitPerShare": profit_per_share,
            "totalProfit": total_item_profit,
            "companyName": company_name
        })

    # Update MongoDB
    await db.users.update_one(
        {"_id": user_id},
        {"$set": {"username": username, "portfolio": updated_portfolio, "profit": total_profit}}
    )

    return {"message": "User updated successfully", "username": username, "portfolio": updated_portfolio, "profit": total_profit}
