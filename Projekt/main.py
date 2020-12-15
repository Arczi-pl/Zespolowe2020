import hashlib
from typing import List
import jwt
import os
from dotenv import load_dotenv, find_dotenv
import uvicorn
from sqlalchemy.orm import Session
from fastapi import Depends, FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.responses import RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from fastapi_login.exceptions import InvalidCredentialsException
from fastapi_login import LoginManager
import models, schemas, crud
from database import engine, SessionLocal

models.Base.metadata.create_all(bind=engine)

load_dotenv(find_dotenv())

SECRET_KEY = os.environ.get("KEY")

app = FastAPI()
manager = LoginManager(SECRET_KEY, tokenUrl='/login')

origins = [
    "http://localhost:8080",
    "http://0.0.0.0:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = None
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

app = FastAPI()

app.mount("/static", StaticFiles(directory="static", html = True), name="static")

@manager.user_loader
def load_user(email: str, db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, email)
    return user

@app.post("/send")
def upload_file(
        file: UploadFile = File(...),
        user = Depends(manager),
        db: Session = Depends(get_db),
):
    print(file)
    return {"Ok": "Ok"}

@app.post('/login')
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = load_user(form_data.username, db)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    if hashlib.sha256(form_data.password.encode('utf-8')).hexdigest() != user.password:
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    access_token = manager.create_access_token(
        data=dict(sub=user.email)
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/register")
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    user_exists = crud.get_user_by_username(db, email = user.email)
    if user_exists:
        raise HTTPException(status_code=400, detail="Username already registered")
    user = crud.create_user(db, user = user)
    return user


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
