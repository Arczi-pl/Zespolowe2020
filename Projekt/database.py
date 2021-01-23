import os
from dotenv import load_dotenv, find_dotenv

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv(find_dotenv())

SQL_ALCHEMY_URL = os.environ.get('SQL_URL')

engine = create_engine(
    SQL_ALCHEMY_URL,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
