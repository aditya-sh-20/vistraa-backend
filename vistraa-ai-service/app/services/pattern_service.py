import os
from PIL import Image, ImageDraw

def generate_placeholder_pattern(prompt: str) -> str:
    output_dir = os.path.join("static", "patterns")
    os.makedirs(output_dir, exist_ok=True)
    file_path = os.path.join(output_dir, "pattern_generated.png")
    
    img = Image.new("RGB", (512, 512), color=(240, 240, 240))
    draw = ImageDraw.Draw(img)
    draw.rectangle([64, 64, 448, 448], fill=(70, 130, 180), outline=(0, 0, 0))
    draw.text((120, 250), f"Prompt: {prompt[:20]}", fill=(255, 255, 255))
    img.save(file_path)
    
    return "http://localhost:8000/static/patterns/pattern_generated.png"