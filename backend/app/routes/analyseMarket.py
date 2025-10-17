# app/routes/analyseMarket.py

from fastapi import APIRouter, HTTPException
from app.services.analyzeStock import analyze_company
from app.config import settings
from motor.motor_asyncio import AsyncIOMotorClient

router = APIRouter()

# MongoDB client
client = AsyncIOMotorClient(settings.MONGODB_URL)
db = client[settings.DATABASE_NAME]

@router.get("/analyze/{ticker}")
async def analyze(ticker: str, future_days: int = 90):
    """
    Returns stock + tweet analysis for a given company ticker.
    Checks against MongoDB companies collection.
    """
    ticker = ticker.upper()

    # Check if ticker exists in MongoDB
    company = await db.companies.find_one({"ticker": ticker})
    if not company:
        raise HTTPException(status_code=404, detail="Company not supported")

    try:
        result = await analyze_company(ticker, future_days=future_days)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
