# Oz Cast Photo Processing — Prompt & Instructions

## Method
Use OpenAI `gpt-image-1` image edit API. Send original photo + prompt. Resize result to 400x600.

## Color Reference (Pantone)
- **Dark background:** `#001A14` (near-black teal)
- **Mid background:** `#0A3D2E` (dark teal-emerald) ← dominant tone
- **Bright swirls:** up to `#1A6B4A` (luminous emerald)
- **NOT pure green, lime, or forest green** — must be blue-toned teal

## Prompt (working version — approved 2026-03-29 v3)

```
Transform this portrait photo for a theater musical website. CRITICAL: preserve the person's exact facial features, mouth shape, expression, eye shape, nose, and skin tone from the original photo — do not alter them.

BACKGROUND COLOR (must match exactly): Use a dark teal-emerald green background. The dominant background color must be hex #0A3D2E (dark teal-emerald), with darker edges around #001A14 and brighter swirl highlights up to #1A6B4A. Do NOT use pure green, lime green, or forest green — it must be a blue-toned teal emerald green.

Add prominent, luminous swirling magical patterns and sparkles to the background. Change clothing to the same teal-emerald green tone. Professional theatrical headshot with magical Oz / Emerald City theme. Keep the same pose and framing.
```

## For Isabel Cleffi (Vestuario) — add this to prompt:
```
Add subtle wardrobe/costume design elements like golden scissors, thread spools, and measuring tape woven into the background swirl patterns.
```

## Code
```python
import openai, base64
from PIL import Image
import io

client = openai.OpenAI()

response = client.images.edit(
    model="gpt-image-1",
    image=open(INPUT_PATH, "rb"),
    prompt=PROMPT,
    size="1024x1536"
)

img_data = base64.b64decode(response.data[0].b64_json)
img = Image.open(io.BytesIO(img_data))
img = img.resize((400, 600), Image.LANCZOS)
img.save(OUTPUT_PATH, 'JPEG', quality=92)
```

## Output
- Size: 400x600 px
- Format: JPEG, quality 92
- Location: `images/elenco/<nombre-apellido>.jpg`

## Notes
- Don't try to mask/rembg — the AI edit approach produces much better results
- The face won't be 100% identical but preserves key features (approved by Nico)
- Key: don't change the mouth from original expression
- Swirls should be prominent and luminous (not subtle)
- Hex colors in prompt help maintain consistency across all photos
