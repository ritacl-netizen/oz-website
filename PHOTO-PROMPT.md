# Oz Cast Photo Processing — Prompt & Instructions

## Method
Use OpenAI `gpt-image-1` image edit API. Send original photo + prompt. Resize result to 400x600.

## Prompt (working version — approved 2026-03-29)

```
Transform this portrait photo for a theater musical website. CRITICAL: preserve the person's exact facial features, mouth shape, expression, eye shape, nose, and skin tone from the original photo — do not alter them. Replace the background with a rich dark teal-emerald green background with prominent, luminous swirling magical patterns and sparkles. The green should have a teal/blue-green tone, not pure green. Change their clothing to the same teal-emerald green. Professional theatrical headshot with magical Oz / Emerald City theme. Keep the same pose and framing.
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
