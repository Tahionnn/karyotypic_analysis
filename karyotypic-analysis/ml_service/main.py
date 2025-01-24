from fastapi import FastAPI
from ml.router import ml_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()


app.include_router(ml_router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["POST"],
)
