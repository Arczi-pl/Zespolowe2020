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

def get_folder_content(db, user, folder):
    files = db.query(models.File).filter(
        models.File.username == user,
        models.File.folder == folder,
    ).all()

    file_names = []
    for file in files:
        file_names.append(file.file_name)

    return file_names

def create_folder(db, user, form):
    folder_name = form.folder_name

    new_folder = models.Folder(
        username = user,
        name = folder_name,
    )

    try:
        path = os.path.join('files', user, folder_name)
        os.makedirs(path)

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
        path = os.path.join('files', user, folder)

        files = db.query(models.File).filter(
            models.File.username == user,
            models.File.folder == folder,
        ).all()

        for file in files:
            os.remove(os.path.join(path, file.file_name))
            db.delete(file)

        os.remove(path)

        db.delete(folder)
        db.commit()
    except:
        return False

    return True

def rename_folder(db, user, form):
    new_folder_name = form.new_folder_name
    old_folder_name = form.old_folder_name

    folder = db.query(models.Folder).filter(
        models.Folder.username == user,
        models.Folder.name == old_folder_name,
    ).first()

    if not folder:
        return False

    try:
        folder.name = new_folder_name

        old_path = os.path.join('files', user, old_folder_name)
        new_path = os.path.join('files', user, new_folder_name)
        os.rename(old_path, new_path)

        files = db.query(models.File).filter(
            models.File.username == user,
            models.File.folder == old_folder_name,
        ).all()

        for file in files:
            file.folder = new_folder_name

        db.commit()
    except:
        return False

    return True

# Sharing link

def list_shared_files(db, link):
    try:
        (user, folder) = jwt.decode(link, secret, algorithms=["HS256"]).subject
    except:
        return False

    return get_folder_content(db, user, folder)

def download_shared_file(db, link, form):
    try:
        (user, folder) = jwt.decode(link, secret, algorithms=["HS256"]).subject
    except:
        return False

    file_name = form.file_name

    if check_file_existance(db, user, folder, file_name):
        return os.path.join('files', user, folder, file_name)
    else:
        return False

def create_sharing_link(db, user, form):
    folder = form.folder_name

    if check_folder_existance(db, user, folder):
        sharing_link = jwt.encode(
            {"subject": [user, folder], "exp": datetime.utcnow()},
            secret,
            algorithm = "HS256"
        )

        return sharing_link
    else:
        return False

# File operations

def check_file_existance(db, user, folder, name):
    return db.query(models.File).filter(
        models.File.username == user,
        models.File.folder == folder,
        models.File.file_name == name,
    ).first()

def save_files(db, user, files, folder):
    dir_path = os.path.join('files', user, folder)

    if not os.path.exists(dir_path):
        try:
            form = schemas.Folder_create
            form.folder_name = folder

            create_folder(db, user, form)
        except Exception as e:
            print(e)

    try:
        for uploaded_file in files:
            file_name = uploaded_file.filename
            file_path = os.path.join(dir_path, file_name)

            with open(file_path, "wb+") as file_object:
                file_object.write(uploaded_file.file.read())

            new_file = models.File(
                file_name = file_name,
                folder = folder,
                username = user,
            )

            db.add(new_file)
            db.commit()
    except Exception as e:
        print(e)
        return False

    return True

def download_file(db, user, form, folder):
    file_name = form.file_name

    if check_file_existance(db, user, folder, file_name):
        file_path = os.path.join('files', user, folder, file_name)

        return file_path
    else:
        return False

def delete_file(db, user, form, folder):
    file_name = form.file_name

    file = check_file_existance(db, user, folder_file_name)

    if file:
        file_path = os.path.join('files', user, folder, file_name)

        try:
            os.remove(path)

            db.delete(file)
            db.commit()
        except:
            return False

        return True
    else:
        return False

def rename_file(db, user, form, folder):
    old_file_name = form.old_file_name
    new_file_name = form.new_file_name

    file = check_file_existance(db, user, folder, old_file_name)

    if file:
        try:
            dir_path = os.path.join('files', user, folder)
            old_path = os.path.join(dir_path, old_file_name)
            new_path = os.path.join(dir_path, new_file_name)

            file.file_name = new_file_name
            os.rename(old_path, new_path)

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
        (email + secret).encode('utf-8')
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

    request =  db.query(models.Token).filter(
        models.Token.token == token
    ).first()

    if not request:
        return False

    user = db.query(models.User).filter(
        models.User.email == entry.email
    ).first()

    try:
        user.password = hashlib.sha256(new_password.encode('utf-8')).hexdigest()

        db.commit()
    except Exception as e:
        print(e)

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
