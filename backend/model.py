import os
import torch
import torchvision.transforms as transforms
from torchvision import models
from PIL import Image
import io
import json


CLASSES = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
    'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew', 'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 'Corn_(maize)___Common_rust_',
    'Corn_(maize)___Northern_Leaf_Blight', 'Corn_(maize)___healthy', 'Grape___Black_rot',
    'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 'Grape___healthy',
    'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot', 'Peach___healthy',
    'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 'Potato___Early_blight',
    'Potato___Late_blight', 'Potato___healthy', 'Raspberry___healthy', 'Soybean___healthy',
    'Squash___Powdery_mildew', 'Strawberry___Leaf_scorch', 'Strawberry___healthy',
    'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight',
    'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite', 'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus', 'Tomato___healthy'
]

TREATMENTS = {
    "Apple_scab": "Apply fungicide (captan or myclobutanil). Remove infected leaves.",
    "Black_rot": "Prune infected areas. Apply copper-based fungicide.",
    "Bacterial_spot": "Use copper bactericide. Avoid overhead irrigation.",
    "Late_blight": "Apply chlorothalonil fungicide immediately. Remove infected plants.",
    "Early_blight": "Apply mancozeb fungicide. Ensure proper plant spacing.",
    "Powdery_mildew": "Apply sulfur-based fungicide. Improve air circulation.",
    "Leaf_blight": "Apply copper fungicide. Remove and destroy infected leaves.",
    "Common_rust": "Apply fungicide at first sign. Use resistant varieties next season.",
    "Northern_Leaf_Blight": "Apply fungicide. Rotate crops next season.",
    "Cercospora_leaf_spot": "Apply fungicide. Avoid overhead watering.",
    "Haunglongbing": "No cure. Remove infected trees to prevent spread.",
    "Esca": "Prune infected wood. Apply fungicide to wounds.",
    "Spider_mites": "Apply miticide or neem oil. Increase humidity.",
    "Target_Spot": "Apply fungicide. Remove infected leaves immediately.",
    "Yellow_Leaf_Curl_Virus": "Control whitefly population. Remove infected plants.",
    "mosaic_virus": "Remove infected plants. Control aphid population.",
    "Leaf_scorch": "Ensure adequate watering. Apply balanced fertilizer.",
    "healthy": "Plant looks healthy! Maintain current care routine.",
}

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

def load_model(model_path: str = "plant_model.pth"):
    model = models.mobilenet_v2(weights="IMAGENET1K_V1")
    model.classifier[1] = torch.nn.Linear(model.last_channel, len(CLASSES))
    if os.path.exists(model_path):
        model.load_state_dict(torch.load(model_path, map_location="cpu"))
        print(f"✅ Trained model loaded!")
    else:
        print(f"⚠️ No trained model found, using pretrained weights")
    model.eval()
    return model

MODEL = load_model()
print(f"✅ Model loaded with {len(CLASSES)} classes")

def predict(image_bytes: bytes) -> dict:
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    tensor = transform(image).unsqueeze(0)

    with torch.no_grad():
        outputs = MODEL(tensor)
        probs = torch.softmax(outputs, dim=1)
        confidence, predicted = torch.max(probs, 1)

    label = CLASSES[predicted.item()]
    parts = label.split("___")
    crop = parts[0].replace("_", " ")
    condition = parts[1].replace("_", " ") if len(parts) > 1 else "Unknown"

    treatment = TREATMENTS.get("healthy" if "healthy" in label else
                next((k for k in TREATMENTS if k in label), None),
                "Consult a local agronomist for treatment advice.")

    return {
        "crop": crop,
        "condition": condition,
        "confidence": round(confidence.item() * 100, 1),
        "is_healthy": "healthy" in label.lower(),
        "treatment": treatment,
        "label": label
    }