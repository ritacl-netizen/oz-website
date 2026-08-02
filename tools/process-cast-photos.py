#!/usr/bin/env python3
"""Procesa fotos nuevas del elenco para el carrusel del sitio.

Uso:
    python3 tools/process-cast-photos.py images/nuevas/

Por cada foto genera dos versiones en images/:
    cast-<n>.jpg       800px de alto  -> la que se ve en el carrusel
    cast-<n>-full.jpg  1600px de alto -> la que se ve al agrandar

Las horizontales se recortan a cuadrado desde el centro para que no queden
desproporcionadas al lado de las verticales. Al terminar imprime las lineas
listas para pegar en js/cast-photos.js.

Requiere: pip3 install Pillow
"""
import os
import re
import sys
import glob
from PIL import Image

IMAGES_DIR = 'images'
STRIP_HEIGHT = 800
FULL_HEIGHT = 1600
STRIP_QUALITY = 82
FULL_QUALITY = 85


def next_free_number():
    used = set()
    for path in glob.glob(os.path.join(IMAGES_DIR, 'cast-*.jpg')):
        match = re.match(r'cast-(\d+)(-full)?\.jpg$', os.path.basename(path))
        if match:
            used.add(int(match.group(1)))
    return max(used) + 1 if used else 1


def resize_to_height(img, height):
    if img.height <= height:
        return img
    width = round(img.width * height / img.height)
    return img.resize((width, height), Image.LANCZOS)


def crop_landscape_to_square(img):
    if img.width <= img.height:
        return img
    left = (img.width - img.height) // 2
    return img.crop((left, 0, left + img.height, img.height))


def process(source_path, number):
    img = Image.open(source_path).convert('RGB')
    img = crop_landscape_to_square(img)

    name = 'cast-%d' % number
    strip = resize_to_height(img, STRIP_HEIGHT)
    strip.save(os.path.join(IMAGES_DIR, name + '.jpg'), 'JPEG',
               quality=STRIP_QUALITY, optimize=True)

    full = resize_to_height(img, FULL_HEIGHT)
    full.save(os.path.join(IMAGES_DIR, name + '-full.jpg'), 'JPEG',
              quality=FULL_QUALITY, optimize=True)

    def kb(path):
        return os.path.getsize(os.path.join(IMAGES_DIR, path)) // 1024

    print('  %-28s -> %s.jpg (%dx%d, %dK) + %s-full.jpg (%dK)' % (
        os.path.basename(source_path), name, strip.width, strip.height,
        kb(name + '.jpg'), name, kb(name + '-full.jpg')))

    return {'n': name, 'w': strip.width, 'h': strip.height}


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 1

    source_dir = sys.argv[1]
    sources = sorted(
        p for p in glob.glob(os.path.join(source_dir, '*'))
        if p.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))
    )
    if not sources:
        print('No encontre imagenes en %s' % source_dir)
        return 1

    number = next_free_number()
    print('Procesando %d fotos, empezando en cast-%d:\n' % (len(sources), number))

    entries = []
    for source in sources:
        entries.append(process(source, number))
        number += 1

    print('\nAgregá estas lineas a js/cast-photos.js (antes del cierre "];"):\n')
    for entry in entries:
        print("    { n: '%(n)s', w: %(w)d, h: %(h)d, full: true }," % entry)
    return 0


if __name__ == '__main__':
    sys.exit(main())
