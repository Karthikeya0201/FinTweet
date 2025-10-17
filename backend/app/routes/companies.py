# app/routes/companies.py
from fastapi import APIRouter
from app.config import settings
from motor.motor_asyncio import AsyncIOMotorClient

router = APIRouter()

# MongoDB client
client = AsyncIOMotorClient(settings.MONGODB_URL)
db = client[settings.DATABASE_NAME]

@router.get("/companies")
async def get_companies():
    """
    Return all companies as an array of {ticker, name}.
    """
    companies_cursor = db.companies.find()
    companies = []
    async for c in companies_cursor:
        companies.append({"ticker": c["ticker"], "name": c["name"]})
    return companies
