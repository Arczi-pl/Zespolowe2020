from sqlalchemy import Column, Integer, String
from database import Base

MAX_STRING_LEN = 64

class User(Base):
    __tablename__ = "users"

    email = Column(
        String(MAX_STRING_LEN),
        unique=True,
        primary_key=True,
        index=True)
    username = Column(
        String(MAX_STRING_LEN),
        unique=True,
        index=True)
    password = Column(String(MAX_STRING_LEN))

class File(Base):
    __tablename__ = "files"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )
    owner = Column(
        String(MAX_STRING_LEN),
        index=True)
    file = Column(String(MAX_STRING_LEN))
