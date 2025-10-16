import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings  # works if run as module from backend root

companies = [
    {"ticker": "AAPL", "name": "Apple Inc."},
    {"ticker": "TSLA", "name": "Tesla Inc."},
    {"ticker": "MSFT", "name": "Microsoft Corporation"},
    {"ticker": "GOOGL", "name": "Alphabet Inc."},
    {"ticker": "AMZN", "name": "Amazon.com Inc."},
    {"ticker": "NVDA", "name": "NVIDIA Corporation"},
    {"ticker": "META", "name": "Meta Platforms Inc."},
    {"ticker": "RELIANCE.NS", "name": "Reliance Industries Limited"},
    {"ticker": "TCS.NS", "name": "Tata Consultancy Services"},
    {"ticker": "INFY.NS", "name": "Infosys Limited"},
    {"ticker": "HDFCBANK.NS", "name": "HDFC Bank Limited"},
    {"ticker": "ADANIGREEN.NS", "name": "Adani Green Energy Limited"},
    {"ticker": "ICICIBANK.NS", "name": "ICICI Bank Limited"},
    {"ticker": "NIFTY50", "name": "Nifty 50 Index"},
    {"ticker": "BAJAJ-AUTO.NS", "name": "Bajaj Auto Limited"},
]

async def insert_companies():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]

    existing = await db["companies"].count_documents({})
    if existing > 0:
        print("Companies collection already has data. Skipping insertion.")
        return

    result = await db["companies"].insert_many(companies)
    print(f"Inserted {len(result.inserted_ids)} companies successfully.")

if __name__ == "__main__":
    asyncio.run(insert_companies())
