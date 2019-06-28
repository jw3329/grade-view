from flask import Flask
import os

db_path = os.path.abspath(os.getcwd()) + '/grade_view/database/grade_view.db'
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_path
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True