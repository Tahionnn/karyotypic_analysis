from pydantic import BaseModel, Field
from typing import Optional, List, Dict



class ImageBase(BaseModel):
    image_src: str
    boxes: Optional[Dict[str, List[List[float]]]]
    notebook_id: Optional[int] = 'null' 
    user_id: Optional[int] = 'null' 


class CommentBase(BaseModel):
    comment: str
    notebook_id: Optional[int] = 'null' 
    user_id: Optional[int] = 'null' 


class NotebookPublic(BaseModel):
    title: str
    user_id: Optional[int] = 'null' 
    image: ImageBase
    comment: CommentBase