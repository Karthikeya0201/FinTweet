from fastapi import APIRouter, HTTPException, Depends
from app.config import settings
from app.services.yfinance_helper import get_stock_price
from passlib.context import CryptContext
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import date
from app.services.loginHelper import LoginPayload, verify_password, create_access_token, TokenResponse
from app.services.userDetails import get_current_user
import logging

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# MongoDB client
client = AsyncIOMotorClient(settings.MONGODB_URL)
db = client[settings.DATABASE_NAME]

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.post("/register")
async def register_user(payload: dict):
    try:
        username = payload.get("username")
        email = payload.get("email")
        password = payload.get("password")
        confirm_password = payload.get("confirmPassword")
        portfolio = payload.get("portfolio", [])
        use_today = payload.get("useToday", True)

        # Validation
        if not email:
            raise HTTPException(status_code=400, detail="Email is required")
        
        # Check if user exists
        existing_user = await db.users.find_one({"email": email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already exists")

        # Validate and hash password if provided
        hashed_password = None
        if password is not None:
            if confirm_password is not None and password != confirm_password:
                raise HTTPException(status_code=400, detail="Passwords do not match")
            password_bytes = password.encode('utf-8')
            if len(password_bytes) > 72:
                password = password_bytes[:72].decode('utf-8', errors='ignore')
                logger.warning("Password truncated to 72 bytes")
            hashed_password = pwd_context.hash(password)

        # Process portfolio
        processed_portfolio = []
        for item in portfolio:
            ticker = item.get("company")
            quantity = item.get("quantity")
            purchase_date = item.get("purchaseDate")

            if not ticker or quantity is None or quantity < 0:
                logger.warning(f"Skipping invalid portfolio item: ticker={ticker}, quantity={quantity}")
                continue

            if use_today or not purchase_date:
                purchase_date = date.today().isoformat()

            try:
                price = get_stock_price(ticker)  # Make sure this returns float
                if price is None:
                    logger.error(f"Failed to fetch price for ticker {ticker}")
                    continue
            except Exception as e:
                logger.error(f"Error fetching price for {ticker}: {str(e)}")
                continue

            processed_portfolio.append({
                "companyId": ticker,
                "quantity": quantity,
                "purchaseDate": purchase_date,
                "currentPrice": price
            })

        # Create user
        user_doc = {
            "username": username,  # Can be None
            "email": email,
            "password": hashed_password,  # None for Google signup
            "portfolio": processed_portfolio,
            "profit": 0.0
        }

        result = await db.users.insert_one(user_doc)
        return {"message": "User registered successfully", "userId": str(result.inserted_id)}
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginPayload):
    user = await db.users.find_one({"email": payload.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Handle Google OAuth users (password: None)
    if user.get("password") is None:
        if payload.password is not None and payload.password != "":
            raise HTTPException(status_code=401, detail="Invalid email or password")
    # Handle regular users (password required)
    elif payload.password is None or not verify_password(payload.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Create JWT token
    token_data = {"sub": str(user["_id"]), "email": user["email"]}
    token = create_access_token(token_data)

    return {"access_token": token, "token_type": "bearer"}
@router.get("/auth/me")
async def me(current_user=Depends(get_current_user)):
    current_user["_id"] = str(current_user["_id"])
    return current_user