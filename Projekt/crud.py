from sqlalchemy.orm import Session

import models, schemas
import hashlib

def save_file(db: Session, user, file):
    return 1

def get_user_by_username(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = hashlib.sha256(user.password.encode('utf-8')).hexdigest()
    new_user = models.User(
        email = user.email,
        username = user.username,
        password = hashed_password,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {
        "email" : user.email,
        "username" : user.username,
    }
