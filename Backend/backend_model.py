from fastapi import FastAPI, File, UploadFile,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf

app = FastAPI()

PREDICTION_THRESHOLD = 0.90

# Allow CORS (so React Native can connect)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # in production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model once at startup
model = load_model("plant_detection_model.keras")

def preprocess_image(img: Image.Image, target_size=(224, 224)):
    """
    Resizes and prepares the image to be fed into the model.
    """
    # Resize the image to the target size required by the model.
    if img.size != target_size:
        img = img.resize(target_size)
    
    # Convert the PIL image to a NumPy array (values from 0-255).
    img_array = tf.keras.utils.img_to_array(img)
    
    # Create a batch by adding an extra dimension.
    # The model expects input of shape (batch_size, height, width, channels).
    img_array = np.expand_dims(img_array, axis=0)
    
    # NOTE: The rescaling of pixel values (from [0, 255] to [-1, 1]) is handled
    # by the `Rescaling` layer inside the loaded model itself. We do not need
    # to manually apply it here. This correctly matches the training setup.
    return img_array

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    # Read file as image
    try:
        contents = await file.read()
        img = Image.open(BytesIO(contents)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file provided.")

    # Preprocess
    input_data = preprocess_image(img)

    # Predict
    preds = model.predict(input_data)
    score = float(preds[0][0])

    is_plant = score > PREDICTION_THRESHOLD

    return { "prediction": "plant" if is_plant else "not_plant"}
