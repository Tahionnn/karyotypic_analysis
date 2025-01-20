from fastapi import FastAPI, HTTPException, status, Depends, APIRouter, Response
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Annotated
from ..models import User
from ..models import Notebook, Image, Comment
from ..database import get_session
from .schemas import UserRegister
from ..auth.router import *
from ..utils import commit_session
from sqlalchemy import select, delete, update, join
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta, timezone
import base64


user_router = APIRouter(prefix='/user', tags=['Users methods'])


@user_router.get("/users/me/", response_model=UserRegister)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_user)],
):
    return current_user


@user_router.delete("/delete/{user_id}")
async def delete_user_by_id(
    current_user: Annotated[User, Depends(get_current_user)],
    user_id: int,
    session: AsyncSession = Depends(get_session),
):
    user = await session.get(user)

    if user is None:
        raise HTTPException(status_code=404, detail="No matches found")
    
    await session.delete(user)

    await commit_session(session)
        
    return {
        'response': Response(status_code=200),
        'message': f'user with id={user_id} was deleted sucessfully'
        }
 


@user_router.get("/get/notebooks_list")
async def get_notebooks_list(
    user: Annotated[User, Depends(get_current_user)],
    session: AsyncSession = Depends(get_session),
):
    query = (
        select(
            Notebook.id.label("id"),
            Notebook.title.label("title"),
            Image.image_src.label("image_src"),
            Image.boxes.label("boxes"),
            Comment.comment.label("comment")
        )
        .join(Image, Image.notebook_id == Notebook.id)
        .join(Comment, Comment.notebook_id == Notebook.id)
        .where(Notebook.user_id == user.id)
    )

    query_result = await session.execute(query)
    notebooks = query_result.all()

    if not notebooks:
        raise HTTPException(status_code=404, detail="No matches found")

    return [
        {
            "notebook_id": notebook.id,
            "notebook_title": notebook.title,
            "image": base64.b64encode(notebook.image_src).decode('utf-8') if notebook.image_src else None,
            "boxes": notebook.boxes,
            "comment": notebook.comment
        }
        for notebook in notebooks
    ]
