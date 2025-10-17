# app/services/analyseStock.py
import asyncio
import json
from app.utils.llmHelper import llm_model
from app.utils.stockPredict import predict_stock
from app.utils.tweetsPredict import predict_tweet


async def analyze_company(ticker: str, future_days: int = 90):
    """
    Combines stock price prediction (Prophet) and tweet sentiment.
    Returns:
      - Weighted final score
      - Recommendation: Buy / Hold / Sell
      - Risk level: Low / Medium / High
      - LLM explanation (concise)
      - Historical + predicted data for charting
    """

    ticker = ticker.strip().upper()

    # Run stock & tweet prediction concurrently
    stock_task = asyncio.create_task(predict_stock(ticker, future_days=future_days, plot=False))
    tweet_task = asyncio.create_task(predict_tweet(ticker))
    stock_result, tweet_score = await asyncio.gather(stock_task, tweet_task)

    # Compute weighted final score
    stock_score = stock_result["directional_score"]
    final_score = round(0.4 * stock_score + 0.6 * tweet_score, 4)

    # Determine simple recommendation
    if final_score > 0.7:
        recommendation = "Buy"
    elif final_score < 0.3:
        recommendation = "Sell"
    else:
        recommendation = "Hold"

    # Risk level based on volatility and score
    price_change_pct = stock_result["pct_change"]
    if abs(price_change_pct) > 10 or final_score < 0.4 or final_score > 0.9:
        risk = "High"
    elif abs(price_change_pct) > 5:
        risk = "Medium"
    else:
        risk = "Low"

    # Prepare prompt for LLM explanation
    llm = await llm_model(temp=0.8)

    # `stock_result["data"]` is already a JSON-safe list; no need for fillna()
    chart_data_json = stock_result["data"]

    # Convert timestamps in last 30 days to strings for LLM prompt
    historical_data_json = []
    for row in chart_data_json[-30:]:
        row_copy = row.copy()
        if 'ds' in row_copy:
            row_copy['ds'] = str(row_copy['ds'])
        historical_data_json.append(row_copy)
    historical_data_json_str = json.dumps(historical_data_json, indent=2)

    prompt = f"""
You are a financial assistant for retail investors.

Company/Ticker: {ticker}
Last Price: {stock_result['last_price']}
Predicted Price ({future_days} days): {stock_result['predicted_price']}
% Change (Prophet): {stock_result['pct_change']:.3f}%
Stock Model Score (0-1): {stock_score}
Tweet Sentiment Score (0-1): {tweet_score}
Combined Score (0-1): {final_score}
Recommendation: {recommendation}
Risk Level: {risk}

Historical closing prices (last 30 days):
{historical_data_json_str}

Explain this to the user in **simple words** in under 100 words. Highlight:
- Expected market direction (bullish / bearish / neutral)
- How sentiment and forecast interact
- Caution or optimistic signals
"""
    try:
        explanation = (await llm.ainvoke(prompt)).content
    except Exception as e:
        explanation = f"Error generating explanation: {str(e)}"

    # Build final result for frontend
    result = {
        "ticker": ticker,
        "last_price": stock_result["last_price"],
        "predicted_price": stock_result["predicted_price"],
        "pct_change": stock_result["pct_change"],
        "stock_score": stock_score,
        "tweet_score": tweet_score,
        "final_score": final_score,
        "recommendation": recommendation,
        "risk": risk,
        "metrics": stock_result["metrics"],
        "explanation": explanation,
        # Data for charting (already JSON-safe)
        "data": chart_data_json,
    }

    return result
