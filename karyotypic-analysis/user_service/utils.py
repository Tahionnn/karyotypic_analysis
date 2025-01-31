from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException


async def commit_session(session: AsyncSession):
    try:
        await session.commit()
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail=str(e))


def read_secret(secret_name: str) -> str:
    secret_path = f"/run/secrets/{secret_name}"
    try:
        with open(secret_path, "r") as file:
            return file.read().strip()
    except FileNotFoundError:
        raise FileNotFoundError(f"Secret {secret_name} not found")