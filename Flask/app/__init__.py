from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_mail import Mail, Message


app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
login = LoginManager(app)
login.login_view = 'login'
#ZSEzse123
#testy_strony_banku@wp.pl
app.config['MAIL_SERVER']='smtp.poczta.onet.pl'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'kadziola@vp.pl'
app.config['MAIL_PASSWORD'] = 'BTzmgPs69'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
mail = Mail(app)


from app import routes, models
