from langchain_google_genai import ChatGoogleGenerativeAI
from app.config import settings

API_KEY = settings.GEMINI_API_KEY

if not API_KEY:
    raise ValueError("Set GEMINI_API_KEY in your .env file")


async def llm_model(temp: float = 0.1):
    """
    Returns a ChatGoogleGenerativeAI instance asynchronously.
    """
    try:
        llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash-lite",
            google_api_key=API_KEY,
            temperature=temp,
        )
        return llm
    except Exception as e:
        print("Error creating LLM model:", e)
        raise e
