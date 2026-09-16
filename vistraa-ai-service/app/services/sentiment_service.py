import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch.nn.functional as F

class SentimentAnalyzer:
    def __init__(self):
        # DistilBERT pre-trained model for sentiment classification
        self.model_name = "distilbert-base-uncased-finetuned-sst-2-english"
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(self.model_name)
        self.model.eval()

    def analyze(self, text: str) -> dict:
        inputs = self.tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            padding=True,
            max_length=512
        )
        
        with torch.no_grad():
            outputs = self.model(**inputs)
            predictions = F.softmax(outputs.logits, dim=-1)
            
        negative_score = float(predictions[0][0])
        positive_score = float(predictions[0][1])

        # Mood & Intensity calculations for GAN pipeline
        if positive_score > 0.6:
            label = "POSITIVE"
            intensity = positive_score
        elif negative_score > 0.6:
            label = "NEGATIVE"
            intensity = negative_score
        else:
            label = "NEUTRAL"
            intensity = max(positive_score, negative_score)

        return {
            "text": text,
            "label": label,
            "score": round(max(positive_score, negative_score), 4),
            "positive_score": round(positive_score, 4),
            "negative_score": round(negative_score, 4),
            "intensity": round(intensity, 4)
        }

sentiment_service = SentimentAnalyzer()