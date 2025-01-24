import base64
from pydantic import BaseModel
from typing import List, Dict, Optional


class ResponseModel(BaseModel):
    boxes: Dict[str, Optional[List[List[float]]]]
