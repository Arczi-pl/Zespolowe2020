from sqlalchemy.orm import Session
from sqlalchemy import or_

import models, schemas
import hashlib
import os

def create_sharing_link(db, user, folder_name):
    return 1

def get_list_of_files(db, user, form):
    folder = form.folder
    files = db.query(models.File).filter(
        models.File.username == user,
        models.File.folder == folder,
    ).all()

    file_names = []
    for file in files:
        file_names.append(file.filename)

    return file_names

def save_files(db, user, form):
    files = form.files
    folder = form.folder
    dir_path = 'files/' + user + '/' + folder + '/'

    if not os.path.exists(dir_path):
        os.mkdir(dir_path)

    try:
        for uploaded_file in files:
            filename = uploaded_file.filename
            file_path = dir_path + filename

            with open(file_path, "wb+") as file_object:
                file_object.write(uploaded_file.file.read())

            new_file = models.File(
                file_path = file_path,
                username = user,
            )

            db.add(new_file)
            db.commit()
    except:
        return False

    return True

def get_file(db, user, form, folder):
    file_path = 'files/' + user + '/' + folder + '/' + form.file_path

    return db.query(models.File).filter(
        models.File.file_path == file_path
    ).first().file_path

def delete_file(db, user, form):
    file_path = form.file_path
    file = db.query(models.File).filter(
        models.File.file_path == file_path
    ).first()

    if file:
        path = file.file_path

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

def check_user_existance(db: Session, form):
    email = form.email
    username = form.username

    return db.query(models.User).filter(
        or_(models.User.email == email, models.User.username == username)
    ).first()

def create_user(db: Session, user):
    email = user.email
    username = user.username

    hashed_password = hashlib.sha256(
        user.password.encode('utf-8')
    ).hexdigest()

    new_user = models.User(
        email = email,
        username = username,
        password = hashed_password,
    )

    db.add(new_user)
    db.commit()

    return {
        "email" : email,
        "username" : username,
    }

def create_resetting_pass_token(db: Session, form):
    email = form.email
    if not db.query(models.User).filter(models.User.email == email).first():
        return False

    generated_token = hashlib.sha256(
        (email + "Bezp5").encode('utf-8')
    ).hexdigest()

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

def change_users_password(db: Session, form):
    token = form.token
    new_password = form.new_password

    entry =  db.query(models.Token).filter(
        models.Token.token == token
    ).first()
    if not entry:
        return False

    user = db.query(models.User).filter(
        models.User.email == entry.email
    ).first()
    user.password = hashlib.sha256(new_password.encode('utf-8')).hexdigest()

    db.commit()

    return True

def compare_password(db: Session, form):
    email = form.email
    password = form.password
    user = get_user_by_username(db, email)

    if not user:
        return False

    if hashlib.sha256(password.encode('utf-8')).hexdigest() != user.password:
        return False

    return True
