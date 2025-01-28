from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from .schemas import TokenData
import jwt
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from typing import Annotated
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from ..users.schemas import *
from ..models import User
from ..database import get_session, async_session_maker


def read_secret(secret_name: str) -> str:
    secret_path = f"/run/secrets/{secret_name}"
    try:
        with open(secret_path, "r") as file:
            return file.read().strip()
    except FileNotFoundError:
        raise FileNotFoundError(f"Secret {secret_name} not found")


SECRET_KEY = read_secret("jwt_key")
ALGORITHM = read_secret("algorithm")
ACCESS_TOKEN_EXPIRE_MINUTES = read_secret("token_expire")


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def authenticate_user(
    username_or_email: str,
    password: str,
):
    async with async_session_maker() as session:
        result_user = await session.execute(
            select(User).where(
                or_(User.username == username_or_email, User.email == username_or_email)
            )
        )
        user = result_user.scalar_one_or_none()
    if (
        not user
        or verify_password(plain_password=password, hashed_password=user.password)
        is False
    ):
        return None
    return user


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    async with async_session_maker() as session:
        result_user = await session.execute(
            select(User).where(User.username == token_data.username)
        )
        user = result_user.scalar_one_or_none()
    if user is None:
        raise credentials_exception
    return user
