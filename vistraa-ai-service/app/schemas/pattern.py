from pydantic import BaseModel, Field

class PatternRequest(BaseModel):
    text_prompt: str = Field(..., min_length=2, max_length=1000, json_schema_extra={"example": "Energetic summer vibes with bright sunshine"})
    label: str = Field("POSITIVE", json_schema_extra={"example": "POSITIVE"})
    intensity: float = Field(0.85, ge=0.0, le=1.0, json_schema_extra={"example": 0.85})

class PatternResponse(BaseModel):
    file_path: str
    base64_png: str
    resolution: str
    palette_mapped: dict