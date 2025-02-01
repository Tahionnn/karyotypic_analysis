from contextlib import asynccontextmanager
from fastapi import FastAPI

from .database import create_tables

@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_tables()
    yield


def create_application():
    return FastAPI(
        lifespan=lifespan,
        redoc_url=None,
    )