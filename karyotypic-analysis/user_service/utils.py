from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException


async def commit_session(session: AsyncSession):
    try:
        await session.commit()
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail=str(e))
