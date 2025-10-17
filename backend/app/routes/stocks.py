from fastapi import APIRouter, HTTPException, Query
from app.services.yfinance_helper import get_stock_price, get_stock_history

router = APIRouter()

@router.get("/stocks/history/{ticker}")
async def stock_history(ticker: str, range: str = Query("1d")):
    """
    range options: 5d, 1m, 3m, 6m, 1y, max
    """
    history = get_stock_history(ticker, range)
    if not history:
        raise HTTPException(status_code=404, detail="Stock data not found")
    current_price = get_stock_price(ticker)

    # Calculate daily change
    if len(history) > 1:
        dailyChange = current_price - history[-2]["close"]
    else:
        dailyChange = 0

    return {"ticker": ticker, "prices": history, "currentPrice": current_price, "dailyChange": dailyChange}
