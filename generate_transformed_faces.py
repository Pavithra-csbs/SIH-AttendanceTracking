import os
import random
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

REFERENCE_DIR = "reference_faces"
TRANSFORMED_DIR = "transformed_faces"

os.makedirs(TRANSFORMED_DIR, exist_ok=True)

def add_noise(image, amount=0.1):
    img_array = np.array(image, dtype=np.uint8)  
    num_pixels = int(amount * img_array.size)

    for _ in range(num_pixels):
        y, x = np.random.randint(0, img_array.shape[0]), np.random.randint(0, img_array.shape[1])
        img_array[y, x] = np.clip(np.random.randint(0, 256), 0, 255)

    return Image.fromarray(img_array, mode="RGB")

def distort_image(image):
    w, h = image.size
    x_shift = random.randint(-w // 3, w // 3)
    y_shift = random.randint(-h // 3, h // 3)
    return image.transform((w, h), Image.AFFINE, (1, random.uniform(-0.5, 0.5), x_shift, random.uniform(-0.5, 0.5), 1, y_shift))

def pixel_shuffle(image, intensity=0.3):
    img_array = np.array(image, dtype=np.uint8)
    h, w, _ = img_array.shape
    num_pixels = int(h * w * intensity)

    for _ in range(num_pixels):
        y1, x1 = np.random.randint(0, h), np.random.randint(0, w)
        y2, x2 = np.random.randint(0, h), np.random.randint(0, w)
        img_array[y1, x1], img_array[y2, x2] = img_array[y2, x2], img_array[y1, x1]

    return Image.fromarray(img_array, mode="RGB")

def transform_image(image, index):
    if index % 12 == 0:
        image = image.rotate(random.randint(-180, 180))
    if index % 12 == 1:
        image = ImageEnhance.Brightness(image).enhance(random.uniform(0.05, 3.0))
    if index % 12 == 2:
        image = ImageEnhance.Contrast(image).enhance(random.uniform(0.1, 4.0))
    if index % 12 == 3:
        image = ImageEnhance.Sharpness(image).enhance(random.uniform(0.0, 10.0))
    if index % 12 == 4:
        image = image.filter(ImageFilter.GaussianBlur(radius=random.uniform(3, 8)))
    if index % 12 == 5:
        image = add_noise(image, amount=random.uniform(0.05, 0.2))
    if index % 12 == 6:
        image = image.convert("L").convert("RGB")
    if index % 12 == 7:
        image = image.transpose(Image.FLIP_LEFT_RIGHT)
    if index % 12 == 8:
        image = distort_image(image)
    if index % 12 == 9:
        image = image.filter(ImageFilter.FIND_EDGES)
    if index % 12 == 10:
        image = image.filter(ImageFilter.EMBOSS)
    if index % 12 == 11:
        image = pixel_shuffle(image, intensity=random.uniform(0.1, 0.5))
    
    return image

for filename in os.listdir(REFERENCE_DIR):
    if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        img_path = os.path.join(REFERENCE_DIR, filename)
        student_name = os.path.splitext(filename)[0]

        image = Image.open(img_path).convert("RGB")
        student_folder = os.path.join(TRANSFORMED_DIR, student_name)
        os.makedirs(student_folder, exist_ok=True)

        for i in range(100):
            transformed_image = transform_image(image.copy(), i)
            transformed_image.save(os.path.join(student_folder, f"{student_name}_{i+1}.jpg"))

        print(f"Saved 100 distorted images for {student_name}")

print("Extreme transformation process completed.")
