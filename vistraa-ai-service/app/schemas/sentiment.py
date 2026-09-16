from pydantic import BaseModel, Field

class SentimentRequest(BaseModel):
    text: str = Field(..., min_length=2, max_length=1000, example="I feel energetic, vibrant, and full of joy today!")

class SentimentResponse(BaseModel):
    text: str
    label: str
    score: float
    positive_score: float
    negative_score: float
    intensity: float