from sqlalchemy.orm import Session
from sqlalchemy import or_

import models, schemas
import hashlib
import os
import jwt

secret = os.environ.get("KEY")

# Folders

def check_folder_existance(db, user, folder_name):
    return db.query(models.Folder).filter(
        models.Folder.username == user,
        models.Folder.name == folder_name,
    ).first()

def get_list_of_folders(db, user):
    folders = db.query(models.Folder).filter(
        models.Folder.username == user,
    ).all()

    folder_names = []
    for folder in folders:
        folder_names.append(folder.name)

    return folder_names

def get_folder_content(db, user):
    files = db.query(models.File).filter(
        models.File.username == user,
    ).all()

    file_names = []
    for file in files:
        file_names.append(file.filename)

    return file_names

def create_folder(db, user, form):
    folder_name = form.folder_name

    new_folder = models.Folder(
        username = user,
        name = folder_name,
    )

    try:
        db.add(new_folder)
        db.commit()
    except Exception as e:
        print(e)
        return False

    return True

def delete_folder(db, user, form):
    folder_name = form.folder_name
    folder = db.query(models.Folder).filter(
        models.Folder.username == user,
        models.Folder.name == folder_name,
    ).first()

    try:
        db.delete(folder)
        db.commit()
    except:
        return False

    return True

def rename_folder(db, user, form):
    new_folder_name = form.new_folder_name
    old_folder_name = form.old_folder_name
    folder = db.query(models.Folder).filter(
        models.Folder.name == old_folder_name
    ).first()

    if not folder:
        return False

    try:
        folder.name = new_folder_name

        old_path = 'files/' + old_folder_name
        new_path = 'files/' + new_folder_name
        os.rename(old_path, new_path)

        db.commit()
    except:
        return False

    return True

# Sharing link

def list_shared_files(db, link):
    folder = jwt.decode(link, secret, algorithms=["HS256"]).subject
    return get_folder_content(db, folder)

def download_shared_file(db, link, form):
    user = jwt.decode(link, secret, algorithms=["HS256"]).subject
    file_name = form.file_name
    file_path = 'files/' + user + '/' + file_name

    return db.query(models.File).filter(
        models.File.file_path == file_path
    ).first().file_path

def create_sharing_link(db, user, form):
    # folder = form.folder_name
    folder = user
    sharing_link = jwt.encode({"subject": folder}, secret, algorithm = "HS256")

    return sharing_link
    # if check_folder_existance(db, user, folder):
    #     sharing_link = jwt.encode({"subject": folder}, secret, algorithm = "HS256")
    #     return sharing_link
    # else:
    #     return False

# File operations

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
    file_path = 'files/' + user + '/' + form.file_name

    return db.query(models.File).filter(
        models.File.file_path == file_path
    ).first().file_path

def delete_file(db, user, form):
    file_name = form.file_name
    file_path = 'files/' + user + '/' + file_name
    file = db.query(models.File).filter(
        models.File.file_path == file_path
    ).first()

    if file:
        path = file.file_path

        try:
            os.remove(path)

            db.delete(file)
            db.commit()
        except:
            return False

        return True
    else:
        return False

def rename_file(db, user, form):
    old_file_name = form.old_file_name
    new_file_name = form.new_file_name
    dir_path = 'files/' + user + '/' + old_file_name
    old_path = dir_path + old_file_name
    new_path = dir_path + new_file_name

    file = db.query(models.File).filter(
        models.File.file_path == old_file_path
    ).first()

    if file:
        path = file.file_path

        try:
            file.file_path = new_file_path
            os.rename(old_file_path, new_file_path)

            db.commit()
        except:
            return False

        return True
    else:
        return False

# Account operations

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
