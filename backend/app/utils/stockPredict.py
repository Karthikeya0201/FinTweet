# app/utils/stockPredict.py
import asyncio
import yfinance as yf
import pandas as pd
from prophet import Prophet
from sklearn.metrics import mean_absolute_error, mean_squared_error
import numpy as np
from datetime import datetime, timedelta
import matplotlib.pyplot as plt

async def predict_stock(ticker: str, future_days: int = 90, plot: bool = False):
    """
    Asynchronously predicts future stock prices using Prophet and returns combined (historical + forecast) data.
    Handles NaN values for safe JSON serialization.
    """
    ticker = ticker.strip().upper()
    end_date = datetime.today().strftime("%Y-%m-%d")
    start_date = (datetime.today() - timedelta(days=5 * 365)).strftime("%Y-%m-%d")

    print(f"\n📥 Downloading {ticker} data from {start_date} to {end_date}...")

    # Run blocking yfinance and Prophet code in a background thread
    def _run_forecast():
        data = yf.download(ticker, start=start_date, end=end_date)
        print(f"✅ Data downloaded! {len(data)} rows")

        if isinstance(data.columns, pd.MultiIndex):
            data.columns = [f"{col[0]}_{col[1]}" for col in data.columns.values]
        close_col = next((col for col in data.columns if "close" in col.lower()), None)
        if close_col is None:
            raise ValueError("❌ Could not find a valid 'Close' column in the data.")

        df = data.reset_index()[['Date', close_col]].rename(columns={'Date': 'ds', close_col: 'y'})
        df['y'] = pd.to_numeric(df['y'], errors='coerce')

        # Train Prophet
        model = Prophet(daily_seasonality=True, yearly_seasonality=True, weekly_seasonality=True)
        model.fit(df)

        # Forecast
        future = model.make_future_dataframe(periods=future_days)
        forecast = model.predict(future)

        # Merge
        merged = pd.merge(
            forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']],
            df,
            on='ds',
            how='left'
        ).rename(columns={
            'y': 'actual',
            'yhat': 'predicted',
            'yhat_lower': 'lower',
            'yhat_upper': 'upper'
        })

        # Fill NaN values to prevent JSON serialization errors
        merged = merged.fillna(0)

        hist = merged[merged['actual'] != 0]
        mae = mean_absolute_error(hist['actual'], hist['predicted']) if len(hist) > 0 else 0
        rmse = np.sqrt(mean_squared_error(hist['actual'], hist['predicted'])) if len(hist) > 0 else 0
        mape = np.mean(np.abs((hist['actual'] - hist['predicted']) / hist['actual'])) * 100 if len(hist) > 0 else 0

        last_price = hist['actual'].iloc[-1] if len(hist) > 0 else 0
        predicted_price = merged['predicted'].iloc[-1] if len(merged) > 0 else 0
        pct_change = (predicted_price - last_price) / last_price * 100 if last_price != 0 else 0

        score = round(float(1 / (1 + np.exp(-pct_change / 4.0))), 6)

        if plot:
            plt.figure(figsize=(14, 7))
            plt.plot(merged['ds'], merged['actual'], label='Actual', color='blue')
            plt.plot(merged['ds'], merged['predicted'], label='Predicted', color='orange')
            plt.fill_between(merged['ds'], merged['lower'], merged['upper'], color='orange', alpha=0.2)
            plt.title(f"{ticker} Stock Price Forecast ({future_days} days ahead)")
            plt.xlabel("Date")
            plt.ylabel("Price")
            plt.legend()
            plt.grid(True)
            plt.show()
            model.plot_components(forecast)
            plt.show()

        result = {
            "ticker": ticker,
            "last_price": round(float(last_price), 2),
            "predicted_price": round(float(predicted_price), 2),
            "pct_change": round(float(pct_change), 4),
            "directional_score": score,
            "metrics": {
                "MAE": round(float(mae), 4),
                "RMSE": round(float(rmse), 4),
                "MAPE": round(float(mape), 4),
            },
            "data": merged.to_dict(orient="records")  # safe for JSON
        }

        return result

    return await asyncio.to_thread(_run_forecast)


# === Example Usage ===
async def main():
    result = await predict_stock("AAPL", future_days=90, plot=True)
    print("\n📊 Summary:")
    print(f"Directional Score: {result['directional_score']}")
    print(f"Change %: {result['pct_change']:.3f}%")
    print(f"MAE: {result['metrics']['MAE']}")
    print("\n=== Combined Data (Last 10 Rows) ===")
    print(result['data'][-10:])


if __name__ == "__main__":
    asyncio.run(main())
