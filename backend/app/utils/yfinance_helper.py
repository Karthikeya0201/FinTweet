import yfinance as yf

def get_stock_price(ticker):
    try:
        stock = yf.Ticker(ticker)
        data = stock.history(period="1d")
        if not data.empty:
            return round(data['Close'].iloc[-1], 2)
        return None
    except Exception as e:
        print(f"Error fetching {ticker}: {e}")
        return None
