import asyncio
import random
from tqdm import tqdm
import pandas as pd
import torch
import torch.nn.functional as F
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from textblob import TextBlob
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings


# === MongoDB Setup ===
client = AsyncIOMotorClient(settings.MONGODB_URL)
db = client[settings.DATABASE_NAME]


# === Load Sentiment Models ===
print("🔹 Loading sentiment models...")
vader = SentimentIntensityAnalyzer()
finbert_model_name = "yiyanghkust/finbert-tone"
tokenizer = AutoTokenizer.from_pretrained(finbert_model_name)
finbert_model = AutoModelForSequenceClassification.from_pretrained(finbert_model_name)
print("✅ Sentiment models loaded.")


# === Helper Functions ===
def normalize_score(score, old_min=-1, old_max=1, new_min=0, new_max=1):
    normalized = ((score - old_min) / (old_max - old_min)) * (new_max - new_min) + new_min
    return normalized


def finbert_sentiment(text: str) -> float:
    """Return FinBERT sentiment score in range [-1, 1]"""
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
    outputs = finbert_model(**inputs)
    probs = F.softmax(outputs.logits, dim=-1).detach().numpy()[0]
    score = probs[1] - probs[2]  # positive - negative
    return score


async def predict_tweet(company_name: str) -> float:
    """
    Analyzes tweet sentiments for a company's influencers.
    Returns a final authority-weighted sentiment score (0–1).
    """
    print(f"\n📌 Starting sentiment prediction for {company_name}...")

    # 1️⃣ Get company influencers
    company = await db.companyData.find_one({"symbol": company_name.upper()})
    if not company:
        print(f"❌ Company {company_name} not found in DB")
        guess = round(random.uniform(0.4, 0.6), 4)
        return guess

    influencers = company.get("influential_people", [])
    if not influencers:
        print(f"❌ No influencers found for {company_name}")
        return 0.5

    print(f"🔹 Found influencers: {influencers}")

    influencer_scores = []
    authority_scores = []

    # 2️⃣ Process each influencer with tqdm
    for name in tqdm(influencers, desc="Processing Influencers"):
        doc = await db.tweets.find_one({"influencer.name": name})
        if not doc or "tweets" not in doc:
            continue

        authority = doc["influencer"].get("authority_score", 0.5)
        tweets = [t["tweet_text"] for t in doc["tweets"]]
        if not tweets:
            continue

        # Run in background thread (FinBERT heavy)
        def analyze_tweets():
            scores = []
            for tweet in tqdm(tweets, desc=f"Tweets of {name}", leave=False):
                v = normalize_score(vader.polarity_scores(tweet)["compound"])
                t = normalize_score(TextBlob(tweet).sentiment.polarity)
                f = normalize_score(finbert_sentiment(tweet))
                ensemble = 0.3 * v + 0.2 * t + 0.5 * f
                scores.append(ensemble)
            avg_score = sum(scores) / len(scores)
            return avg_score

        avg_influencer_score = await asyncio.to_thread(analyze_tweets)
        influencer_scores.append(avg_influencer_score)
        authority_scores.append(authority)

    # 3️⃣ Compute authority-weighted final score
    if not influencer_scores:
        print(f"⚠️ No tweets found for {company_name}")
        return 0.5

    weighted_sum = sum(s * a for s, a in zip(influencer_scores, authority_scores))
    total_auth = sum(authority_scores)
    final_score = round(weighted_sum / total_auth if total_auth else 0.5, 4)

    print(f"\n📊 Final authority-weighted sentiment for {company_name}: {round(final_score, 4)}")
    return float(final_score)


# === Example Usage ===
if __name__ == "__main__":
    asyncio.run(predict_tweet("TSLA"))
