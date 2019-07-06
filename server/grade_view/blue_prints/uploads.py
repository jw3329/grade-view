from flask import Blueprint
from flask_login import login_required
from grade_view import app, UPLOAD_FOLDER
import os

uploads = Blueprint('uploads', __name__)

@uploads.route('/<path:path>',methods=['GET'])
@login_required
def upload_file(path):
    return f'{UPLOAD_FOLDER}/{path}'

app.register_blueprint(uploads, url_prefix='/uploads')
