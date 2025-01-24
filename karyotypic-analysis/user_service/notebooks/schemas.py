from pydantic import BaseModel, Field
from typing import Optional, List, Dict


class ImageBase(BaseModel):
    image_src: bytes
    boxes: Optional[Dict[str, List[List[float]]]]


class CommentBase(BaseModel):
    comment: str


class NotebookPublic(BaseModel):
    title: str
    image: ImageBase
    comment: CommentBase


class UpdateNotebook(BaseModel):
    title: str
    comment: CommentBase
