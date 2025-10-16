from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import date

# -----------------------------
# Company Schema
# -----------------------------
class Company(BaseModel):
    ticker: str = Field(..., description="Stock ticker symbol, e.g., AAPL, RELIANCE.NS")
    name: str = Field(..., description="Full company name, e.g., Apple Inc.")

# -----------------------------
# Portfolio Item Schema
# -----------------------------
class PortfolioItem(BaseModel):
    companyId: str = Field(..., description="Reference to a company _id")
    quantity: int = Field(..., description="Number of shares owned")
    purchaseDate: date = Field(..., description="Date of purchase")

# -----------------------------
# User Schema
# -----------------------------
class User(BaseModel):
    username: str = Field(..., description="Unique username")
    email: EmailStr = Field(..., description="Unique email")
    password: str = Field(..., description="Hashed password")
    portfolio: Optional[List[PortfolioItem]] = Field(default_factory=list)
    profit: Optional[float] = Field(0.0, description="Calculated or stored gain")
