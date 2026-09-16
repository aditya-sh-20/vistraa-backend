from fastapi import APIRouter, HTTPException, status
from app.schemas.sentiment import SentimentRequest, SentimentResponse
from app.schemas.pattern import PatternRequest, PatternResponse
from app.schemas.pipeline import UnifiedPipelineRequest, UnifiedPipelineResponse
from app.services.sentiment_service import sentiment_service
from app.services.pattern_service import pattern_service
from app.services.pipeline_service import pipeline_service

api_router = APIRouter()

@api_router.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "online",
        "service": "Vistraa AI Engine",
        "version": "1.0.0"
    }

@api_router.post("/sentiment/analyze", response_model=SentimentResponse, tags=["Affective Engine"])
def analyze_sentiment(payload: SentimentRequest):
    try:
        return sentiment_service.analyze(payload.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sentiment processing failure: {str(e)}")

@api_router.post("/pattern/generate", response_model=PatternResponse, tags=["Generative Engine"])
def generate_pattern(payload: PatternRequest):
    try:
        return pattern_service.generate_pattern(
            text_prompt=payload.text_prompt,
            label=payload.label,
            intensity=payload.intensity
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pattern generation failure: {str(e)}")

@api_router.post("/ai/generate-fabric", response_model=UnifiedPipelineResponse, tags=["Unified AI Engine"])
def generate_fabric_from_sentiment(payload: UnifiedPipelineRequest):
    try:
        return pipeline_service.process_text_to_pattern(payload.text_prompt)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unified pipeline execution failure: {str(e)}"
        )