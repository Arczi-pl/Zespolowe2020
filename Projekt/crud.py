from sqlalchemy.orm import Session
from sqlalchemy import or_

import models, schemas
import hashlib
import os

def create_sharing_link(db, user, folder_name):
    return 1

def get_list_of_files(db, user):
    files = db.query(models.File).filter(models.File.username == user).all()

    print(files)
    file_names = []
    for file in files:
        file_names.append(file.filename)

    return file_names

def save_files(db, user, files):
    dir_path = 'files/' + user + '/'

    if not os.path.exists(dir_path):
        os.mkdir(dir_path)

    try:
        for uploaded_file in files:
            filename = uploaded_file.filename
            file_path = dir_path + filename

            with open(file_path, "wb+") as file_object:
                file_object.write(uploaded_file.file.read())

            print(filename)
            new_file = models.File(
                filename = filename,
                username = user,
            )

            db.add(new_file)
            db.commit()
    except Exception as e:
        print(e)
        return False

    return True


def get_file(db, user, file_path):
    return db.query(models.File).filter(models.File.filename == file_path).first()

def delete_file(db, user, file_path):
    file = db.query(models.File).filter(models.File.filename == file_path).first()
    if file:
        path = "files/" + user + '/' + file.filename

        os.remove(path)
        db.delete(file)
        db.commit()

        return True
    else:
        return False

def get_user_by_username(db: Session, name: str):
    return db.query(models.User).filter(
        or_(models.User.email == name, models.User.username == name)
    ).first()

def check_user_existance(db: Session, email: str, username):
    return db.query(models.User).filter(
        or_(models.User.email == email, models.User.username == username)
    ).first()

def create_user(db: Session, user: schemas.User_creation):
    hashed_password = hashlib.sha256(user.password.encode('utf-8')).hexdigest()
    new_user = models.User(
        email = user.email,
        username = user.username,
        password = hashed_password,
    )

    db.add(new_user)
    db.commit()

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

    return True

def compare_password(db: Session, password: str, email: str):
    user = get_user_by_username(db, email)

    if not user:
        return False

    if hashlib.sha256(password.encode('utf-8')).hexdigest() != user.password:
        return False

    return True
