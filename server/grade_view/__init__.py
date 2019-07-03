from flask_cors import CORS
from flask import Flask
import os
from flask_sqlalchemy import SQLAlchemy

UPLOAD_FOLDER = '/uploads/profile'

db_path = os.path.abspath(os.getcwd()) + '/grade_view/database/grade_view.db'
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_path
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['SECRET_KEY'] = b'\x10wEL\x1d\xba\xec\x9cge\xa8\xb15\xf3GO\x0b\x8c\xb9\xf6\xbf\x02R\xf3'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

db = SQLAlchemy(app)

CORS(app,supports_credentials=True)

from grade_view.setup_database import database_setup
from grade_view.models import User, MajorUserRelationship, Major
import grade_view.blue_prints

database_setup(db)