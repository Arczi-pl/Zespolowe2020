from sqlalchemy.orm import Session

import models, schemas
import hashlib

def create_sharing_link(db, user, folder_name):
    return 1

def save_files(db, user, files):
    return 1

def save_file(db, user, file):
    return 1

def get_file(db, user, file_path):
    return 1

def delete_file(db, user, file_path):
    return 1

def get_user_by_username(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.User_creation):
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

def create_resetting_pass_token(db: Session, email: str):
    if not db.query(models.User).filter(models.User.email == email).first():
        return False
    generated_token = hashlib.sha256((email + "Bezp5").encode('utf-8')).hexdigest()
    new_token = models.Token(
        email = email,
        token = generated_token,
    )
    db.add(new_token)
    db.commit()
    db.refresh(new_token)

    content = generated_token
    msg = MIMEText(content, text_subtype)
    msg['Subject'] = "Password reset"
    msg['From'] = sender_email

    conn = SMTP(smtp_server)
    conn.set_debuglevel(False)
    conn.login(sender_email, password)
    try:
        conn.sendmail(sender_email, email, msg.as_string())
    finally:
        conn.quit()

    return True

def change_users_password(db: Session, token, new_password: str):
    entry =  db.query(models.Token).filter(models.Token.token == token).first()
    if not entry:
        return False
    user = db.query(models.User).filter(models.User.email == entry.email).first()
    user.password = hashlib.sha256(new_password.encode('utf-8')).hexdigest()
    db.commit()
    db.refresh(user)
    return True

def compare_password(db: Session, password: str, email: str):
    user = get_user_by_username(db, email)

    if not user:
        return False

    if hashlib.sha256(password.encode('utf-8')).hexdigest() != user.password:
        return False

    return True
