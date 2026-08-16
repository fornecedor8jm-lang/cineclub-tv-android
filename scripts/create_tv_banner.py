from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

out = Path('/home/ubuntu/cineclub-android-tv/assets/images/android-tv-banner.png')
out.parent.mkdir(parents=True, exist_ok=True)
image = Image.new('RGB', (1280, 720), '#07191F')
draw = ImageDraw.Draw(image)
for x in range(1280):
    shade = int(7 + (x / 1280) * 18)
    draw.line((x, 0, x, 720), fill=(shade, 25 + int(x / 80), 31 + int(x / 40)))
font_path = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
font = ImageFont.truetype(font_path, 112)
small = ImageFont.truetype(font_path, 32)
word = 'cineclub'
box = draw.textbbox((0, 0), word, font=font)
w = box[2] - box[0]
draw.text(((1280-w)/2, 235), word, font=font, fill='#F5EBDD')
accent_start = (1280+w)/2 - 205
draw.rectangle((accent_start, 365, accent_start + 410, 376), fill='#D86C5C')
sub = 'CINECLUB TV'
sub_box = draw.textbbox((0, 0), sub, font=small)
draw.text(((1280-(sub_box[2]-sub_box[0]))/2, 410), sub, font=small, fill='#D8A59A')
image.save(out, 'PNG', optimize=True)
