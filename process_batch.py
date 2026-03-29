#!/usr/bin/env python3
import openai, base64, io, sys
from PIL import Image

client = openai.OpenAI()

PROMPT = """Transform this portrait photo for a theater musical website. CRITICAL: preserve the person's exact facial features, mouth shape, expression, eye shape, nose, and skin tone from the original photo — do not alter them. Replace the background with a rich dark teal-emerald green background with prominent, luminous swirling magical patterns and sparkles. The green should have a teal/blue-green tone, not pure green. Change their clothing to the same teal-emerald green. Professional theatrical headshot with magical Oz / Emerald City theme. Keep the same pose and framing."""

photos = [
    ("/Users/claw/.openclaw/media/inbound/7d498686-b43e-45c8-8790-28d8f7cef430.jpg", "images/elenco/jess-demestoy.jpg", "Jessica Demestoy"),
    ("/Users/claw/.openclaw/media/inbound/4e905142-63a4-481f-a517-0a9f368f0fdf.jpg", "images/elenco/diego-de-leon.jpg", "Diego de León"),
]

for i, (src, dst, name) in enumerate(photos):
    print(f"[{i+1}/{len(photos)}] {name}...", flush=True)
    try:
        response = client.images.edit(
            model="gpt-image-1",
            image=open(src, "rb"),
            prompt=PROMPT,
            size="1024x1536"
        )
        img_data = base64.b64decode(response.data[0].b64_json)
        img = Image.open(io.BytesIO(img_data))
        img = img.resize((400, 600), Image.LANCZOS)
        img.save(dst, 'JPEG', quality=92)
        print(f"  ✓ Done", flush=True)
    except Exception as e:
        print(f"  ✗ Error: {e}", flush=True)

print("All done!")
