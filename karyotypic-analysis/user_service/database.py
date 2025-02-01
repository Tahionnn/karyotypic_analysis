from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncAttrs
from sqlalchemy.orm import DeclarativeBase, declared_attr, Mapped, mapped_column
from sqlalchemy import func
from sqlalchemy.exc import SQLAlchemyError

from typing import Annotated
from datetime import datetime
from fastapi import HTTPException

import os
from dotenv import load_dotenv


load_dotenv()
db_password = os.getenv("postgres_password")

DATABASE_URL = f"postgresql+asyncpg://admin:{db_password}@postgres:5432/postgres"

engine = create_async_engine(DATABASE_URL)
async_session_maker = async_sessionmaker(engine, expire_on_commit=False)

created_at = Annotated[datetime, mapped_column(server_default=func.now())]
updated_at = Annotated[datetime, mapped_column(server_default=func.now())]


class Base(AsyncAttrs, DeclarativeBase):
    __abstract__ = True

    @declared_attr.directive
    def __tablename__(cls) -> str:
        return f"{cls.__name__.lower()}"

    created_at: Mapped[created_at]
    updated_at_at: Mapped[updated_at]


async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def delete_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


async def get_session():
    try:
        async with async_session_maker() as session:
            yield session
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=str(e))
