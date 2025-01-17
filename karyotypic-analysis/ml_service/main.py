from fastapi import FastAPI
from ml.router import ml_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

'''
routers = (ml_router)

for router in routers:
    app.include_router(router)
'''
app.include_router(ml_router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_credentials=True,
    allow_methods=["POST"],
)
