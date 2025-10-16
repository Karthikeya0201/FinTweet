from pydantic import BaseModel, EmailStr
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from app.config import settings

# MongoDB client
client = AsyncIOMotorClient(settings.MONGODB_URL)
db = client[settings.DATABASE_NAME]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = settings.JWT_SECRET
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


# ---------------------------
# Pydantic models
# ---------------------------
class LoginPayload(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


# ---------------------------
# Helper functions
# ---------------------------
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return token
