from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, companies, user, stocks, analyseMarket

app = FastAPI()

# CORS setup
origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # allow these origins
    allow_credentials=True,
    allow_methods=["*"],         # allow all HTTP methods
    allow_headers=["*"],         # allow all headers
)

# Include routers
app.include_router(auth.router)
app.include_router(companies.router)
app.include_router(user.router)
app.include_router(stocks.router)
app.include_router(analyseMarket.router)

@app.get("/")
async def root():
    return {"message": "FastAPI server is running!"}
