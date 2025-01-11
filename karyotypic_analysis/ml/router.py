from fastapi import FastAPI, HTTPException, File, UploadFile, Depends
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from karyotypic_analysis.ml.YOLOv10 import YOLOv10
from karyotypic_analysis.ml.models import *
import numpy as np
import cv2


#ml_router = APIRouter(prefix='/ml', tags=['Model endpoints'])

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_credentials=True,
    allow_methods=["POST"],
)

model = YOLOv10(model_path="/home/tahion/Documents/GitHub/karyotypic_analysis/karyotypic_analysis/models/best.onnx") 
model.load()

@app.post("/predict")
async def get_predictions(file: UploadFile = File(...)):
    image = await file.read()

    np_array = np.frombuffer(image, np.uint8)
    
    image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
    
    detection_buffer, class_images_buffer = model.postprocess(image)
    
    detection_image = ImageData.from_bytes(detection_buffer)
    class_images = [ImageData.from_bytes(image) for image in class_images_buffer]

    return Predictions(detection_image=detection_image, class_images=class_images)