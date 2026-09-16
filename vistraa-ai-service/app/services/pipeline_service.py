from app.services.sentiment_service import sentiment_service
from app.services.pattern_service import pattern_service

class PipelineOrchestratorService:
    def process_text_to_pattern(self, text_prompt: str) -> dict:
        # Step 1: Run Affective Analysis via DistilBERT
        sentiment_result = sentiment_service.analyze(text_prompt)

        # Step 2: Auto-trigger Generative Synthesis using mapped sentiment metrics
        pattern_result = pattern_service.generate_pattern(
            text_prompt=text_prompt,
            label=sentiment_result["label"],
            intensity=sentiment_result["intensity"]
        )

        # Step 3: Consolidate response payload
        return {
            "sentiment": sentiment_result,
            "pattern": pattern_result
        }

pipeline_service = PipelineOrchestratorService()