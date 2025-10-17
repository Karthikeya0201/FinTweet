import random
import asyncio

async def predict_tweet(company_name: str) -> float:
    """
    Asynchronously simulates sentiment analysis for a company's tweets.
    Returns a random float between 0 (bearish) and 1 (bullish).

    Args:
        company_name (str): Name or ticker of the company.

    Returns:
        float: Random sentiment score in range [0, 1].
    """
    await asyncio.sleep(0.4)  # Simulate I/O delay (optional)
    score = 0.86
    print(f"📊 Simulated sentiment score for {company_name}: {score}")
    return score


# === Example usage ===
if __name__ == "__main__":
    asyncio.run(predict_tweet("Tesla"))
