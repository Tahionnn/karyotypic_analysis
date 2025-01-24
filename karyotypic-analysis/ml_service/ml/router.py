from fastapi import HTTPException, File, UploadFile, Depends, APIRouter
import asyncio

from ml_service.celery_app import app

from ml.models import ResponseModel
from ml.tasks import predict


ml_router = APIRouter(prefix="/ml", tags=["Model endpoints"])


@ml_router.post("/predict")
async def get_predictions(file: UploadFile = File(...)) -> ResponseModel:
    image = await file.read()

    task = predict.delay(image)

    try:
        predictions = await asyncio.to_thread(task.get, timeout=10)
        return predictions
    except TimeoutError:
        return {"error": "Task too long too complete"}
