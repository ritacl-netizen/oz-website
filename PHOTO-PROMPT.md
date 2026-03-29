# Oz Cast Photo Processing — Prompt & Instructions

## Method
Use OpenAI `gpt-image-1` image edit API. Send original photo + prompt. Resize result to 400x600.
**Then always color-correct** using the post-processing script below to match the reference palette.

## Color Reference (from Nico's reference image)
Extracted from the approved swirl background sample:

| Layer | Hex | RGB | Description |
|-------|-----|-----|-------------|
| Dark (shadows) | `#00221E` | (0, 34, 30) | Near-black teal edges |
| Mid (base) | `#013A31` | (1, 58, 49) | Dominant background tone |
| Bright (swirls) | `#096D58` | (9, 109, 88) | Luminous swirl highlights |

**Key metric: B/G ratio ≈ 0.85** (this is what makes it teal vs pure green)

- NOT pure green, lime, or forest green
- Must be blue-toned teal emerald
- Reference file: saved in media inbound `5bfe8ac8-97b1-4862-90e2-a630e2715318.jpg`

## Prompt (v4 — approved 2026-03-29)

```
Transform this portrait photo for a theater musical website. MOST CRITICAL RULE: preserve the person's EXACT facial features with absolute fidelity — face shape, expression, mouth, eyes, nose, skin tone, facial hair MUST remain identical to the original. Do NOT alter or stylize the face.

BACKGROUND: Rich dark teal-emerald green with prominent luminous swirling magical patterns and sparkles. The green must be strongly teal (blue-green), NOT pure green. Think deep ocean emerald. Hex reference: dark #00221E, mid #013A31, bright swirls #096D58. Change clothing to same teal-emerald. Magical Oz / Emerald City theme. Keep same pose and framing.
```

## For Isabel Cleffi (Vestuario) — add this to prompt:
```
Add subtle wardrobe/costume design elements like golden scissors, thread spools, and measuring tape woven into the background swirl patterns.
```

## Post-Processing Color Correction (ALWAYS RUN AFTER AI EDIT)

```python
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter

def color_correct_to_teal(img_path):
    """Correct green areas to match teal reference (B/G ratio ~0.85)"""
    img = np.array(Image.open(img_path)).astype(float)
    h, w = img.shape[:2]
    
    # Get current background stats
    bg = np.concatenate([img[:h//6,:,:].reshape(-1,3), img[:,:w//6,:].reshape(-1,3), img[:,5*w//6:,:].reshape(-1,3)])
    src_avg = bg.mean(axis=0)
    
    # Target B/G ratio from reference
    TARGET_BG_RATIO = 0.85
    current_ratio = max(src_avg[2], 1) / max(src_avg[1], 1)
    
    # Green-dominant mask (avoids face/skin)
    g_dom = (img[:,:,1] > img[:,:,0] * 1.2) & (img[:,:,1] > 15)
    mask = gaussian_filter(g_dom.astype(float), sigma=5)
    
    # Boost blue to match teal
    b_boost = TARGET_BG_RATIO / max(current_ratio, 0.01)
    corrected = img.copy()
    corrected[:,:,2] = img[:,:,2] * (1 + (b_boost - 1) * mask)
    
    corrected = np.clip(corrected, 0, 255).astype(np.uint8)
    Image.fromarray(corrected).save(img_path, 'JPEG', quality=92)
```

## Full Pipeline Code
```python
import openai, base64, io
from PIL import Image

client = openai.OpenAI()

# 1. AI Edit
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

# 2. Color correct
color_correct_to_teal(OUTPUT_PATH)
```

## Output
- Size: 400x600 px
- Format: JPEG, quality 92
- Location: `images/elenco/<nombre-apellido>.jpg`

## Notes
- Don't try to mask/rembg — the AI edit approach produces much better results
- The face won't be 100% identical but preserves key features
- Key: don't change the mouth from original expression
- Swirls should be prominent and luminous (not subtle)
- **ALWAYS run color correction after AI edit** — the AI doesn't reliably hit the exact teal tone
