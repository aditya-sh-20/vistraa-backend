from pydantic import BaseModel, Field
from typing import Dict, List, Optional

class SentimentRequest(BaseModel):
    text: str = Field(..., example="I want a vibrant and energetic outfit for a beach party.")
    user_id: Optional[int] = Field(None, example=1)

class SentimentResponse(BaseModel):
    dominant_emotion: str
    confidence_score: float
    sentiment_scores: Dict[str, float]
    suggested_palette: List[str]