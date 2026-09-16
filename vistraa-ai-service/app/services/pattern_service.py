import os
import io
import base64
import numpy as np
from PIL import Image, ImageDraw

class PatternGeneratorService:
    def __init__(self):
        self.output_dir = "generated_patterns"
        os.makedirs(self.output_dir, exist_ok=True)

    def _map_sentiment_to_palette(self, label: str, intensity: float):
        if label == "POSITIVE":
            base_color = (int(255 * intensity), int(180 * intensity), 50)
            accent_color = (255, 105, 180)
            background = (255, 248, 220)
        elif label == "NEGATIVE":
            base_color = (25, 25, int(112 * intensity))
            accent_color = (139, 0, 0)
            background = (20, 20, 30)
        else:
            base_color = (112, 128, 144)
            accent_color = (188, 143, 143)
            background = (245, 245, 220)
            
        return base_color, accent_color, background

    def generate_pattern(self, text_prompt: str, label: str, intensity: float, resolution: int = 512) -> dict:
        base_color, accent_color, background = self._map_sentiment_to_palette(label, intensity)

        image = Image.new("RGB", (resolution, resolution), background)
        draw = ImageDraw.Draw(image)

        seed = sum(ord(c) for c in text_prompt)
        np.random.seed(seed)

        num_shapes = int(30 * intensity) + 10
        for _ in range(num_shapes):
            x0 = np.random.randint(0, resolution)
            y0 = np.random.randint(0, resolution)
            x1 = x0 + np.random.randint(20, 150)
            y1 = y0 + np.random.randint(20, 150)
            
            fill_color = base_color if np.random.rand() > 0.4 else accent_color
            shape_type = np.random.choice(["ellipse", "rectangle"])

            if shape_type == "ellipse":
                draw.ellipse([x0, y0, x1, y1], fill=fill_color, outline=background)
            else:
                draw.rectangle([x0, y0, x1, y1], fill=fill_color, outline=background)

        buffered = io.BytesIO()
        image.save(buffered, format="PNG")
        base64_image = base64.b64encode(buffered.getvalue()).decode("utf-8")

        filename = f"pattern_{seed}_{label.lower()}.png"
        file_path = os.path.join(self.output_dir, filename)
        image.save(file_path)

        return {
            "file_path": file_path,
            "base64_png": f"data:image/png;base64,{base64_image}",
            "resolution": f"{resolution}x{resolution}",
            "palette_mapped": {
                "base_rgb": base_color,
                "accent_rgb": accent_color
            }
        }

pattern_service = PatternGeneratorService()