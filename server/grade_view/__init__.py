from flask_cors import CORS
from flask import Flask
import os
from flask_sqlalchemy import SQLAlchemy

db_path = os.path.abspath(os.getcwd()) + '/grade_view/database/grade_view.db'
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_path
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

db = SQLAlchemy(app)

CORS(app)

from grade_view.setup_database import database_setup
from grade_view.models import User, MajorUserRelationship, Major
import grade_view.blue_prints

database_setup(db)