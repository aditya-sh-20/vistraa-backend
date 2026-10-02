from app.schemas.sentiment import SentimentRequest, SentimentResponse

class SentimentService:
    def analyze(self, request: SentimentRequest) -> SentimentResponse:
        text_lower = request.text.lower()
        
        if any(word in text_lower for word in ["sad", "gloomy", "dark", "rain"]):
            dominant = "Melancholy"
            palette = ["#2C3E50", "#34495E", "#7F8C8D"]
            scores = {"melancholy": 0.85, "calm": 0.10, "joy": 0.05}
        elif any(word in text_lower for word in ["energetic", "party", "vibrant", "fire"]):
            dominant = "Energetic"
            palette = ["#FF5733", "#FFC300", "#C70039"]
            scores = {"energetic": 0.90, "joy": 0.08, "calm": 0.02}
        else:
            dominant = "Serene"
            palette = ["#A8E6CF", "#DCEDC8", "#FFD3B6"]
            scores = {"calm": 0.75, "joy": 0.20, "melancholy": 0.05}

        return SentimentResponse(
            dominant_emotion=dominant,
            confidence_score=0.92,
            sentiment_scores=scores,
            suggested_palette=palette
        )

sentiment_service = SentimentService()