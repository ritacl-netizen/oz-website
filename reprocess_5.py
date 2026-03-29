#!/usr/bin/env python3
import openai, base64, io, os
from PIL import Image

client = openai.OpenAI()

PROMPT = """Transform this portrait photo for a theater musical website. CRITICAL: preserve the person's exact facial features, mouth shape, expression, eye shape, nose, and skin tone from the original photo — do not alter them. Replace the background with a rich dark teal-emerald green background with prominent, luminous swirling magical patterns and sparkles. The green should have a teal/blue-green tone, not pure green. Change their clothing to the same teal-emerald green. Professional theatrical headshot with magical Oz / Emerald City theme. Keep the same pose and framing."""

photos = [
    ("/Users/claw/.openclaw/media/inbound/0856ce58-7381-4098-b5cb-d2008222fd79.jpg", "images/elenco/carola-favier.jpg"),
    ("/Users/claw/.openclaw/media/inbound/8f056589-7d78-4eae-a3d5-ef44deff38fd.jpg", "images/elenco/paula-elutchanz.jpg"),
    ("/Users/claw/.openclaw/media/inbound/4de98f62-4075-48be-826e-7c01d61e0302.jpg", "images/elenco/emilia-telesca.jpg"),
    ("/Users/claw/.openclaw/media/inbound/49d2a792-dc76-4935-a6c5-829b6b592db7.jpg", "images/elenco/diego-de-leon.jpg"),
    ("/Users/claw/.openclaw/media/inbound/6a04150d-3710-4b34-8969-78cb0b312408.jpg", "images/elenco/jess-demestoy.jpg"),
]

for i, (src, dst) in enumerate(photos):
    name = os.path.basename(dst)
    print(f"[{i+1}/5] {name}...", flush=True)
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
