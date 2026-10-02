from fastapi import APIRouter, HTTPException, status
from app.schemas.sentiment import SentimentRequest, SentimentResponse
from app.services.sentiment_service import sentiment_service

api_router = APIRouter()

@api_router.post("/ai/analyze", response_model=SentimentResponse, status_code=status.HTTP_200_OK)
async def analyze_sentiment(payload: SentimentRequest):
    if not payload.text.strip():
        raise HTTPException(status_code=400, detail="Text prompt cannot be empty.")
    return sentiment_service.analyze(payload)