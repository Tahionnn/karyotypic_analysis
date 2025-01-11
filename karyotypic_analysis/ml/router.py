from fastapi import FastAPI, HTTPException, File, UploadFile, Depends
from fastapi.responses import StreamingResponse
from karyotypic_analysis.ml.YOLOv10 import YOLOv10
import numpy as np
import cv2


#ml_router = APIRouter(prefix='/ml', tags=['Model endpoints'])

app = FastAPI()

model = YOLOv10(model_path="/home/tahion/Documents/GitHub/karyotypic_analysis/karyotypic_analysis/models/best.onnx") 
model.load()

@app.post("/predict")
async def get_predictions(file: UploadFile = File(...)):
    image = await file.read()

    np_array = np.frombuffer(image, np.uint8)
    
    image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
    
    detection_buffer, class_images_buffer = model.postprocess(image)

    return StreamingResponse(content=detection_buffer, media_type="image/png")