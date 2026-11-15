from PIL import Image, ImageDraw, ImageFont
import os

Folder = r"..\vrchat"
MaxWidth = 1920
MaxHeight = 1080
Quality = 75
ValidExtensions = (".png", ".jpg", ".jpeg")

ImageFiles = [
    file for file in os.listdir(Folder)
    if file.lower().endswith(ValidExtensions)
]
ImageFiles.sort(key=lambda file: os.path.getmtime(os.path.join(Folder, file)))

ExistingNumbers = []
for file in os.listdir(Folder):
    if file.lower().endswith(".webp"):
        try:
            name_part = os.path.splitext(file)[0]
            number = int(name_part.split()[-1])
            ExistingNumbers.append(number)
        except (ValueError, IndexError):
            pass

NextNumber = max(ExistingNumbers, default=0) + 1

FontPath = os.path.expandvars(r"%LOCALAPPDATA%\Microsoft\Windows\Fonts\EduTASBeginner-VariableFont_wght.ttf")
try:
    Font = ImageFont.truetype(FontPath, 18)
except IOError:
    Font = ImageFont.load_default()

for file in ImageFiles:
    InputPath = os.path.join(Folder, file)
    OutputPath = os.path.join(Folder, f"vrchat {NextNumber}.webp")

    ImageObject = Image.open(InputPath).convert("RGB")

    ImageObject.thumbnail(
        (MaxWidth, MaxHeight),
        Image.Resampling.LANCZOS
    )

    Draw = ImageDraw.Draw(ImageObject)
    Text = "@MintDraccoon"

    BoundingBox = Draw.textbbox((0, 0), Text, font=Font)
    TextWidth = BoundingBox[2] - BoundingBox[0]
    TextHeight = BoundingBox[3] - BoundingBox[1]

    Margin = 12
    X = ImageObject.width - TextWidth - Margin
    Y = ImageObject.height - TextHeight - Margin

    Draw.text(
        (X, Y),
        Text,
        font=Font,
        fill=(173, 235, 179)
    )

    ImageObject.save(OutputPath, "WEBP", quality=Quality, method=6)
    print(f"{file} -> vrchat {NextNumber}.webp")
    NextNumber += 1

print("Done!")
