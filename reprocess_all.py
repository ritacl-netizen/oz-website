#!/usr/bin/env python3
"""Reprocess all elenco photos with consistent teal-emerald Oz theme."""
import openai, base64, io, sys, os
from PIL import Image

client = openai.OpenAI()

PROMPT = """Transform this portrait photo for a theater musical website. CRITICAL: preserve the person's exact facial features, mouth shape, expression, eye shape, nose, and skin tone from the original photo — do not alter them. Replace the background with a rich dark teal-emerald green background with prominent, luminous swirling magical patterns and sparkles. The green should have a teal/blue-green tone, not pure green. Change their clothing to the same teal-emerald green. Professional theatrical headshot with magical Oz / Emerald City theme. Keep the same pose and framing."""

ISABEL_EXTRA = " Add subtle wardrobe/costume design elements like golden scissors, thread spools, and measuring tape woven into the background swirl patterns."

ELENCO_DIR = "images/elenco"

photos = sorted(os.listdir(ELENCO_DIR))
photos = [p for p in photos if p.endswith('.jpg') and not p.startswith('.') and 'test' not in p and 'patricia.' not in p]

print(f"Processing {len(photos)} photos...")

for i, filename in enumerate(photos):
    filepath = os.path.join(ELENCO_DIR, filename)
    prompt = PROMPT
    if 'isabel' in filename.lower():
        prompt += ISABEL_EXTRA
    
    print(f"[{i+1}/{len(photos)}] {filename}...", flush=True)
    
    try:
        # Back up current version
        backup_dir = os.path.join(ELENCO_DIR, "backup")
        os.makedirs(backup_dir, exist_ok=True)
        import shutil
        shutil.copy2(filepath, os.path.join(backup_dir, filename))
        
        response = client.images.edit(
            model="gpt-image-1",
            image=open(filepath, "rb"),
            prompt=prompt,
            size="1024x1536"
        )
        
        img_data = base64.b64decode(response.data[0].b64_json)
        img = Image.open(io.BytesIO(img_data))
        img = img.resize((400, 600), Image.LANCZOS)
        img.save(filepath, 'JPEG', quality=92)
        print(f"  ✓ Done", flush=True)
    except Exception as e:
        print(f"  ✗ Error: {e}", flush=True)

print("All done!")
