import yfinance as yf
from datetime import datetime, timedelta

def get_stock_price(ticker: str) -> float:
    """
    Fetch the latest stock closing price for today.
    """
    try:
        stock = yf.Ticker(ticker)
        data = stock.history(period="1d")
        if not data.empty:
            return round(data['Close'].iloc[-1], 2)
        return 0.0
    except Exception as e:
        print(f"Error fetching current price for {ticker}: {e}")
        return 0.0


def get_stock_price_on_date(ticker: str, date_str: str) -> float:
    """
    Fetch historical closing price on a given date (YYYY-MM-DD).
    """
    try:
        date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
        stock = yf.Ticker(ticker)
        # Fetch 1 day before and 1 day after to avoid missing data if market closed
        start = date_obj.strftime("%Y-%m-%d")
        end = (date_obj).strftime("%Y-%m-%d")
        data = stock.history(start=start, end=end)
        if not data.empty:
            return round(data['Close'].iloc[-1], 2)
        else:
            # fallback: fetch last available close before date
            data = stock.history(end=start, period="60d")
            if not data.empty:
                # Get last closing price before or on the date
                filtered = data[data.index.date <= date_obj]
                if not filtered.empty:
                    return round(filtered['Close'].iloc[-1], 2)
        return 0.0
    except Exception as e:
        print(f"Error fetching price for {ticker} on {date_str}: {e}")
        return 0.0


def get_stock_history(ticker, range="1m"):
    stock = yf.Ticker(ticker)
    periods = {
        "5d": "5d",
        "1m": "1mo",
        "3m": "3mo",
        "6m": "6mo",
        "1y": "1y",
        "max": "max"
    }
    data = stock.history(period=periods.get(range, "1mo"))
    return [{"date": str(idx.date()), "close": round(row["Close"],2)} for idx, row in data.iterrows()]
