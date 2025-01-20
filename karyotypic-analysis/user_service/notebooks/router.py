from fastapi import APIRouter, HTTPException, status, Depends, Response
from typing import Annotated
from ..models import Notebook, Image, Comment
from ..models import User
from ..database import get_session
from .schemas import NotebookPublic, ImageBase
from ..utils import commit_session
from ..auth.router import *
from ..auth.utils import get_current_user
from sqlalchemy import select, delete, update, insert
from sqlalchemy.ext.asyncio import AsyncSession
import base64


notebook_router = APIRouter(prefix='/notebooks', tags=['Notebooks methods'])


@notebook_router.post("/add/")
async def add_notebook(
    notebook: NotebookPublic, 
    current_user: Annotated[User, Depends(get_current_user)], 
    session: AsyncSession = Depends(get_session),
):
    if notebook.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="User ID does not match current user")
    
    db_notebook = Notebook(
        title=notebook.title, 
        user_id=notebook.user_id
    )
    session.add(db_notebook)

    if notebook.image:
        image_data = base64.b64decode(notebook.image.image_src)
        db_image = Image(
            image_src=image_data, 
            boxes=notebook.image.boxes, 
            notebook_id=db_notebook.id, 
            user_id=notebook.image.user_id
        )
        session.add(db_image)

    if notebook.comment:
        db_comment = Comment(
            comment=notebook.comment.comment, 
            notebook_id=db_notebook.id, 
            user_id=notebook.comment.user_id
        )
        session.add(db_comment)

    await commit_session(session)
    
    return {
        'response': Response(status_code=200),
        'message': f'added book with id={db_notebook.id} at {db_notebook.created_at}'
        }


@notebook_router.get("/get/{notebook_id}") 
async def get_notebook_by_id(
    current_user: Annotated[User, Depends(get_current_user)],
    notebook_id: int, 
    session: AsyncSession = Depends(get_session),
):
    query = (
        select(
            Notebook.id.label("id"),
            Notebook.title.label("title"),
            Notebook.user_id.label("user_id"),
            Image.image_src.label("image_src"),
            Image.boxes.label("boxes"),
            Comment.comment.label("comment")
        )
        .join(Image, Image.notebook_id == Notebook.id)
        .join(Comment, Comment.notebook_id == Notebook.id)
        .where(Notebook.id == notebook_id)
    )
    result = await session.execute(query).scalars().first()
    if result is None:
        raise HTTPException(status_code=404, detail="No matches found")
    
    user_id = result[0].user_id 
    if result.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access forbidden")
        return {
        "id": result.id,
        "title": result.title,
        "user_id": result.user_id,
        "image_src": base64.b64encode(result.image_src).decode('utf-8'),
        "boxes": result.boxes,
        "comment": result.comment
    }


@notebook_router.delete("/delete/{notebook_id}")
async def delete_notebook_by_id(
    current_user: Annotated[User, Depends(get_current_user)],
    notebook_id: int,
    session: AsyncSession = Depends(get_session), 
):
    notebook = await session.get(Notebook, notebook_id)

    if notebook is None:
        raise HTTPException(status_code=404, detail="No matches found")
    if notebook.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access forbidden")
    
    await session.delete(notebook)
    await commit_session(session)
        
    return {
        'response': Response(status_code=200),
        'message': f'book with id={notebook_id} was deleted sucessfully'
        }


@notebook_router.delete("/update/{notebook_id}")
async def update_notebook_by_id(
    current_user: Annotated[User , Depends(get_current_user)],
    notebook_id: int,
    notebook: NotebookPublic,
    session: AsyncSession = Depends(get_session),
):
    result = await session.execute(select(Notebook).where(Notebook.id == notebook_id))
    db_notebook = result.scalar_one_or_none()

    if db_notebook is None:
        raise HTTPException(status_code=404, detail="Notebook not found")

    if notebook.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="User  ID does not match current user")

    db_notebook_data = {
        "title": notebook.title,
        "user_id": notebook.user_id
    }
    update_notebook_stmt = update(Notebook).where(Notebook.id == notebook_id).values(**db_notebook_data)
    await session.execute(update_notebook_stmt)

    if notebook.image:
        image_data = base64.b64decode(notebook.image.image_src)
        db_image_data = {
            "image_src": image_data,
            "boxes": notebook.image.boxes,
            "notebook_id": notebook_id,
            "user_id": notebook.image.user_id
        }
        update_image_stmt = update(Image).where(Image.notebook_id == notebook_id).values(**db_image_data)
        await session.execute(update_image_stmt)

    if notebook.comment:
        db_comment_data = {
            "comment": notebook.comment.comment,
            "notebook_id": notebook_id,
            "user_id": notebook.comment.user_id
        }
        update_comment_stmt = update(Comment).where(Comment.notebook_id == notebook_id).values(**db_comment_data)
        await session.execute(update_comment_stmt)

    await commit_session(session)

    return {
        'response': Response(status_code=200),
        'message': f'Notebook with id={notebook_id} was updated successfully'
    }
