import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

# ist of major U.S. companies
companies = [
    {"ticker": "AAPL", "name": "Apple Inc."},
    {"ticker": "TSLA", "name": "Tesla Inc."},
    {"ticker": "MSFT", "name": "Microsoft Corporation"},
    {"ticker": "GOOGL", "name": "Alphabet Inc."},
    {"ticker": "AMZN", "name": "Amazon.com Inc."},
    {"ticker": "NVDA", "name": "NVIDIA Corporation"},
    {"ticker": "META", "name": "Meta Platforms Inc."},
    {"ticker": "BRK.B", "name": "Berkshire Hathaway Inc."},
    {"ticker": "JPM", "name": "JPMorgan Chase & Co."},
    {"ticker": "V", "name": "Visa Inc."},
    {"ticker": "PG", "name": "Procter & Gamble Co."},
    {"ticker": "JNJ", "name": "Johnson & Johnson"},
    {"ticker": "XOM", "name": "Exxon Mobil Corporation"},
    {"ticker": "WMT", "name": "Walmart Inc."},
    {"ticker": "NFLX", "name": "Netflix Inc."},
]

async def insert_companies():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]

    existing = await db["companies"].count_documents({})
    if existing > 0:
        print("Companies collection already has data. Skipping insertion.")
        return

    result = await db["companies"].insert_many(companies)
    print(f"✅ Inserted {len(result.inserted_ids)} U.S. companies successfully.")

if __name__ == "__main__":
    asyncio.run(insert_companies())
