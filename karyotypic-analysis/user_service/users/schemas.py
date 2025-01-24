from pydantic import BaseModel, Field, EmailStr
from typing import Optional


class UserRegister(BaseModel):
    username: str = Field(..., min_length=1, max_length=50)
    email: EmailStr = Field(...)
    password: str
