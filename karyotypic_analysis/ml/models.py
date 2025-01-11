import base64
from pydantic import BaseModel
from typing import List


class ImageData(BaseModel):
    content: bytes

    @classmethod
    def from_bytes(cls, byte_data: bytes) -> "ImageData":
        encoded_content = base64.b64encode(byte_data).decode('utf-8')
        return cls(content=encoded_content)

    def to_bytes(self) -> bytes:
        return base64.b64decode(self.content)

class Predictions(BaseModel):
    detection_image: ImageData
    class_images: List[ImageData]