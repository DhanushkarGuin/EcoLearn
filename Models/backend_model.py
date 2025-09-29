import base64
import io
import numpy as np
import tensorflow as tf
from fastapi import FastAPI
from pydantic import BaseModel
from PIL import Image

# --- SETUP --- #

# Initialize the FastAPI app
app = FastAPI(title="Plant Recognition API")

# Define the expected input size for your model
MODEL_INPUT_SIZE = (224, 224) 
# Define the class names in the correct order
PLANT_CLASSES = ['Not_Plant','Plant'] # ⚠️ Update with your classes!

# Load your .keras model ONCE when the server starts
# This is crucial for performance!
model = tf.keras.models.load_model('plant_detection_model.keras')
print("✅ Model loaded successfully!")


# --- DATA MODELS (for request and response) --- #

# This model defines the structure of the incoming request JSON
class ImagePayload(BaseModel):
    image: str # This will be a Base64 encoded string


# --- HELPER FUNCTION (for image preprocessing) --- #

def preprocess_image(image_b64: str) -> np.ndarray:
    """Decodes a Base64 image, preprocesses it, and prepares it for the model."""
    # Decode the Base64 string into bytes
    image_bytes = base64.b64decode(image_b64)
    
    # Open the image using Pillow
    img = Image.open(io.BytesIO(image_bytes))
    
    # Ensure image is in RGB format
    if img.mode != 'RGB':
        img = img.convert('RGB')
        
    # Resize the image to the model's expected input size
    img = img.resize(MODEL_INPUT_SIZE)
    
    # Convert the image to a NumPy array
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    
    # Normalize pixel values to be between 0 and 1
    img_array /= 255.0
    
    # Add a batch dimension (e.g., (224, 224, 3) -> (1, 224, 224, 3))
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array


# --- API ENDPOINT --- #

@app.post("/predict")
def predict(payload: ImagePayload):
    """Receives an image, preprocesses it, and returns the model's prediction."""
    # Preprocess the incoming image
    processed_image = preprocess_image(payload.image)
    
    # Make a prediction
    prediction = model.predict(processed_image)
    
    # Get the index of the highest probability
    predicted_class_index = np.argmax(prediction)
    
    # Get the corresponding class name
    predicted_class_name = PLANT_CLASSES[predicted_class_index]
    
    # Get the confidence score
    confidence = float(np.max(prediction))
    
    # Return the result
    return {"predicted_class": predicted_class_name, "confidence": confidence}