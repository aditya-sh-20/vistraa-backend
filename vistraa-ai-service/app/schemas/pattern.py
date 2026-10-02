from pydantic import BaseModel

class FabricRequest(BaseModel):
    text_prompt: str

class FabricResponse(BaseModel):
    status: str
    prompt: str
    pattern_url: str
    sentiment: str
    confidence_score: float