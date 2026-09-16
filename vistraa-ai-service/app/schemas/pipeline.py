from pydantic import BaseModel, Field
from app.schemas.sentiment import SentimentResponse
from app.schemas.pattern import PatternResponse

class UnifiedPipelineRequest(BaseModel):
    text_prompt: str = Field(
        ..., 
        min_length=2, 
        max_length=1000, 
        json_schema_extra={"example": "I feel euphoric, full of vibrant sunshine and electric joy today!"}
    )

class UnifiedPipelineResponse(BaseModel):
    sentiment: SentimentResponse
    pattern: PatternResponse