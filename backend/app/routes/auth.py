# app/routes/auth.py
from fastapi import APIRouter, HTTPException, Depends
from app.config import settings
from app.services.yfinance_helper import get_stock_price
from passlib.context import CryptContext
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import date
from app.services.loginHelper import LoginPayload, verify_password, create_access_token, TokenResponse
from app.services.userDetails import get_current_user
router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# MongoDB client
client = AsyncIOMotorClient(settings.MONGODB_URL)
db = client[settings.DATABASE_NAME]

@router.post("/register")
async def register_user(payload: dict):
    username = payload.get("username")
    email = payload.get("email")
    password = payload.get("password")
    confirm_password = payload.get("confirmPassword")
    portfolio = payload.get("portfolio", [])
    use_today = payload.get("useToday", True)

    # Validation
    if not all([username, email, password, confirm_password]):
        raise HTTPException(status_code=400, detail="Missing required fields")
    if password != confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    # Check if user exists
    existing_user = await db.users.find_one({"$or": [{"username": username}, {"email": email}]})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already exists")

    # Hash password
    if len(password.encode('utf-8')) > 72:
        raise HTTPException(status_code=400, detail="Password must be <= 72 bytes")

    hashed_password = pwd_context.hash(password)

    # Process portfolio
    processed_portfolio = []
    for item in portfolio:
        ticker = item.get("company")
        quantity = item.get("quantity")
        purchase_date = item.get("purchaseDate")

        if use_today or not purchase_date:
            purchase_date = date.today().isoformat()

        # Fetch today's stock price
        price = get_stock_price(ticker)  # Make sure this returns float

        processed_portfolio.append({
            "companyId": ticker,
            "quantity": quantity,
            "purchaseDate": purchase_date,
            "currentPrice": price
        })

    # Create user
    user_doc = {
        "username": username,
        "email": email,
        "password": hashed_password,
        "portfolio": processed_portfolio,
        "profit": 0.0
    }

    result = await db.users.insert_one(user_doc)
    return {"message": "User registered successfully", "userId": str(result.inserted_id)}


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginPayload):
    user = await db.users.find_one({"email": payload.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(payload.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Create JWT token
    token_data = {"sub": str(user["_id"]), "email": user["email"]}
    token = create_access_token(token_data)

    return {"access_token": token, "token_type": "bearer"}

@router.get("/auth/me")
async def me(current_user=Depends(get_current_user)):
    current_user["_id"] = str(current_user["_id"])
    return current_user