import os
from dotenv import load_dotenv, find_dotenv

from typing import List

import uvicorn

from fastapi import Depends, FastAPI, HTTPException, File, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer

from starlette.responses import RedirectResponse, Response

import jwt
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException

import models, schemas, crud
from database import engine, SessionLocal

from sqlalchemy.orm import Session

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

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

@AuthJWT.load_config
def get_config():
    return schemas.Settings()

@app.exception_handler(AuthJWTException)
def authjwt_exception_handler(request: Request, exc: AuthJWTException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message}
    )

@app.post("/create_sharing_link")
def create_sharing_link(
    Authorize: AuthJWT = Depends(),
    db: Session = Depends(get_db),
):
    Authorize.jwt_required()
    user = Authorize.get_jwt_subject()

    return 1

@app.get("/shared_folder/{link}")
def get_shared_files(
    link: str,
    db: Session = Depends(get_db),
):
    return 1

@app.get("/folder")
def get_folder_content(
    Authorize: AuthJWT = Depends(),
    db: Session = Depends(get_db),
):
    Authorize.jwt_required()
    user = Authorize.get_jwt_subject()

    return 1

@app.delete("/delete_file")
def delete_file(
    form: schemas.File_access,
    Authorize: AuthJWT = Depends(),
    db: Session = Depends(get_db),
):
    Authorize.jwt_required()
    user = Authorize.get_jwt_subject()

    return crud.delete_file(db, user, form.file_path)

@app.post("/download_file")
def download_file(
    form: schemas.File_access,
    Authorize: AuthJWT = Depends(),
    db: Session = Depends(get_db),
):
    Authorize.jwt_required()
    user = Authorize.get_jwt_subject()

    path = form.file_path
    file = crud.get_file(db, user, path)
    if not file:
        raise HTTPException(
            status_code=400,
            detail="Problem with uploading file"
        )

    return File_response('files/' + user + '/' + path)

@app.post("/upload_file")
def upload_file(
    files: List[UploadFile] = File(...),
    Authorize: AuthJWT = Depends(),
    db: Session = Depends(get_db),
):
    Authorize.jwt_required()
    user = Authorize.get_jwt_subject()

    if not crud.save_files(db, user, files):
        raise HTTPException(
            status_code=400,
            detail="Problem with uploading"
        )

    return {"desc": "Files successfully saved"}

@app.post("/reset_password")
def create_resetting_pass_token(
    request: schemas.Reset_pass_request,
    db: Session = Depends(get_db),
):
    if not crud.create_resetting_pass_token(db, request.email):
        raise HTTPException(status_code=400, detail="Incorrect username")

    return {"desc": "Check your email"}

@app.post("/change_password")
def change_users_password(
    request: schemas.Reset_pass_form,
    db: Session = Depends(get_db),
):
    return crud.change_users_password(db, request.token, request.new_password)

@app.post('/login')
def login(
    form_data: schemas.User_login,
    db: Session = Depends(get_db),
    Authorize: AuthJWT = Depends(),
):
    status = crud.compare_password(db, form_data.password, form_data.email)

    if not status:
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    access_token = Authorize.create_access_token(
        subject = form_data.email
    )
    refresh_token = Authorize.create_refresh_token(
        subject=form_data.email
    )
    return {"access_token": access_token, "refresh_token": refresh_token}

@app.post("/register")
def create_user(
    user: schemas.User_creation,
    db: Session = Depends(get_db),
):
    user_exists = crud.check_user_existance(db, user.email, user.username)

    if user_exists:
        raise HTTPException(status_code=400, detail="Username already registered")

    new_user = crud.create_user(db, user)
    return new_user

@app.post('/refresh_jwt')
def refresh_jwt_token(Authorize: AuthJWT = Depends()):
    Authorize.jwt_refresh_token_required()
    current_user = Authorize.get_jwt_subject()
    new_access_token = Authorize.create_access_token(subject=current_user)
    return {"access_token": new_access_token}

@app.get("/")
def home():
    return RedirectResponse('/static/index.html')

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
