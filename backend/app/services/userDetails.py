from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from app.config import settings

SECRET_KEY = settings.JWT_SECRET
ALGORITHM = "HS256"

client = AsyncIOMotorClient(settings.MONGODB_URL)
db = client[settings.DATABASE_NAME]

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")  # points to your login endpoint

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")

        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Add company names to portfolio
        for item in user.get("portfolio", []):
            company = await db.companies.find_one({"ticker": item["companyId"]})
            item["companyName"] = company["name"] if company else item["companyId"]

        user["_id"] = str(user["_id"])
        return user

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
