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

# Sharing link functionality

@app.post("/create_sharing_link")
def create_sharing_link(
    form: schemas.Create_sharing_link,
    Authorize: AuthJWT = Depends(),
    db: Session = Depends(get_db),
):
    Authorize.jwt_required()
    user = Authorize.get_jwt_subject()

    link = crud.create_sharing_link(db, user, form)

    if link:
        return {"link": link}
    else:
        return {"desc": "You don't have such folder"}

@app.get("/shared_folder/{link}")
def list_shared_files(
    link: str,
    db: Session = Depends(get_db),
):
    shared_files = crud.list_shared_files(db, link)

    return {"Shared files": shared_files}

@app.get("/download_shared_file/{link}")
def download_shared_file(
    link: str,
    form: schemas.File_download,
    db: Session = Depends(get_db),
):
    file_path = crud.download_shared_file(db, link, form)
    if not file_path:
        raise HTTPException(
            status_code=400,
            detail="Such file doesn't exist"
        )

    return FileResponse(file_path)

# List folders and their content

@app.get("/folders/")
def get_folder_list(
    Authorize: AuthJWT = Depends(),
    db: Session = Depends(get_db),
):
    Authorize.jwt_required()
    user = Authorize.get_jwt_subject()

    folders = crud.get_list_of_folders(db, user)

    return {"Folders": folders}

@app.get("/folder/{folder_name}")
def get_folder_content(
    folder_name: str,
    Authorize: AuthJWT = Depends(),
    db: Session = Depends(get_db),
):
    Authorize.jwt_required()
    user = Authorize.get_jwt_subject()

    list_of_files = crud.get_folder_content(db, user, folder_name)

    return {"files": list_of_files}

# Basic folder actions

@app.post("/create_folder")
def create_folder(
    form: schemas.Folder_create,
    Authorize: AuthJWT = Depends(),
    db: Session = Depends(get_db),
):
    Authorize.jwt_required()
    user = Authorize.get_jwt_subject()

    if crud.create_folder(db, user, form):
        return {"desc": "Folder created"}
    else:
        return {"desc": "Problems with creating folder"}

@app.delete("/delete_folder")
def delete_folder(
    form: schemas.Folder_delete,
    Authorize: AuthJWT = Depends(),
    db: Session = Depends(get_db),
):
    Authorize.jwt_required()
    user = Authorize.get_jwt_subject()

    if crud.delete_folder(db, user, form):
        return {"desc": "Folder deleted"}
    else:
        return {"desc": "Such folder didn't exist"}

@app.post("/rename_folder/{folder_name}")
def rename_folder(
    form: schemas.Folder_rename,
    Authorize: AuthJWT = Depends(),
    db: Session = Depends(get_db),
):
    Authorize.jwt_required()
    user = Authorize.get_jwt_subject()

    if crud.rename_folder(db, user, form):
        return {"desc": "Folder renamed"}
    else:
        return {"desc": "No such folder"}

# Basic file operations

@app.delete("/delete_file/{folder_name}")
def delete_file(
    folder_name: str,
    form: schemas.File_delete,
    Authorize: AuthJWT = Depends(),
    db: Session = Depends(get_db),
):
    Authorize.jwt_required()
    user = Authorize.get_jwt_subject()

    if crud.delete_file(db, user, form, folder_name):
        return {"desc": "File successfully deleted"}
    else:
        return {"desc": "Such file didn't exist"}

@app.delete("/rename_file/{folder_name}")
def rename_file(
    folder_name: str,
    form: schemas.File_rename,
    Authorize: AuthJWT = Depends(),
    db: Session = Depends(get_db),
):
    Authorize.jwt_required()
    user = Authorize.get_jwt_subject()

    if crud.rename_file(db, user, form, folder_name):
        return {"desc": "File successfully renamed"}
    else:
        return {"desc": "Such file didn't exist"}

@app.post("/download_file/{folder_name}")
def download_file(
    folder_name: str,
    form: schemas.File_download,
    Authorize: AuthJWT = Depends(),
    db: Session = Depends(get_db),
):
    Authorize.jwt_required()
    user = Authorize.get_jwt_subject()

    file_path = crud.download_file(db, user, form, folder_name)
    if not file_path:
        raise HTTPException(
            status_code=400,
            detail="Such file doesn't exist"
        )

    return FileResponse(file_path)

@app.post("/upload_file/{folder_name}")
def upload_file(
    folder_name: str,
    files: List[UploadFile] = File(...),
    Authorize: AuthJWT = Depends(),
    db: Session = Depends(get_db),
):
    Authorize.jwt_required()
    user = Authorize.get_jwt_subject()
    if not crud.save_files(db, user, files, folder_name):
        raise HTTPException(
            status_code=400,
            detail="Problem with uploading"
        )

    return {"desc": "Files successfully saved"}

# Account actions

@app.post("/reset_password")
def create_resetting_pass_token(
    request: schemas.Reset_pass_request,
    db: Session = Depends(get_db),
):
    if not crud.create_resetting_pass_token(db, request):
        raise HTTPException(status_code=400, detail="Incorrect username")

    return {"desc": "Check your email"}

@app.post("/change_password")
def change_users_password(
    request: schemas.Reset_pass_form,
    db: Session = Depends(get_db),
):
    return crud.change_users_password(db, request)

@app.post('/login')
def login(
    form_data: schemas.User_login,
    db: Session = Depends(get_db),
    Authorize: AuthJWT = Depends(),
):
    status = crud.compare_password(db, form_data)

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
    form: schemas.User_creation,
    db: Session = Depends(get_db),
):
    user_exists = crud.check_user_existance(db, form)

    if user_exists:
        raise HTTPException(status_code=400, detail="Username already registered")

    new_user = crud.create_user(db, form)

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
