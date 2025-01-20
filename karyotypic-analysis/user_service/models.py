from .database import Base
from typing import List
from sqlalchemy import ForeignKey, JSON, Text, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, timedelta

class User(Base):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String, unique=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    password: Mapped[str]
    
    notebooks: Mapped[List["Notebook"]] = relationship("Notebook", back_populates="user")


class Notebook(Base):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str]
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=True)

    user: Mapped["User"] = relationship("User", back_populates="notebooks")
    images: Mapped["Image"] = relationship("Image", back_populates="notebook", cascade="all, delete-orphan")
    comments: Mapped["Comment"] = relationship("Comment", back_populates="notebook", cascade="all, delete-orphan")


class Image(Base):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    image_src: Mapped[str]
    boxes: Mapped[dict] = mapped_column(JSON)
    notebook_id: Mapped[int] = mapped_column(ForeignKey("notebook.id"), nullable=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=True)

    notebook: Mapped["Notebook"] = relationship('Notebook', back_populates='images')


class Comment(Base):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    comment: Mapped[str] = mapped_column(Text) 
    notebook_id: Mapped[int] = mapped_column(ForeignKey("notebook.id"), nullable=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=True)

    notebook: Mapped["Notebook"] = relationship('Notebook', back_populates='comments')

