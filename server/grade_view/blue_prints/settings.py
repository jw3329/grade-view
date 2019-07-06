from flask import Blueprint, request, jsonify, send_file
from flask_login import login_required, current_user
from grade_view import db, app
from grade_view.models import User, UserSchema
from grade_view import UPLOAD_FOLDER
import os

settings = Blueprint('settings', __name__)

@settings.route('/profile',methods=['PUT'])
@login_required
def profile():
    profile_update_data = request.get_json()
    print(request.files)
    # profile_image = request.files['profile_image']
    print(profile_update_data)
    # print(profile_image)
    # user = User.query.get(current_user.id)
    try:
        current_user.first_name = profile_update_data['first_name']
        current_user.last_name = profile_update_data['last_name']
        current_user.bio = profile_update_data['bio']
        current_user.url = profile_update_data['url']
        current_user.company = profile_update_data['company']
        current_user.location = profile_update_data['location']
        db.session.commit()
        status = True
        message = 'Successfully updated'
    except Exception as e:
        status = False
        message = str(e)
    return jsonify({
        'status':status,
        'message':message,
        'user': UserSchema().dump(current_user).data
    })

@settings.route('/profile_image',methods=['GET','POST'])
@login_required
def profile_image():
    target = f'{UPLOAD_FOLDER}/profile_images'
    if not os.path.isdir(target):
        os.mkdir(target)
    if request.method == 'GET':
        profile_image_filename = current_user.profile_image
        if not profile_image_filename:
            return None
        sending_file = os.path.abspath(f'{target}/{profile_image_filename}')
        return send_file(sending_file,mimetype='image/jpg')
    elif request.method == 'POST':
        try:
            if not request.files: raise Exception('No profile picture uploaded')
            profile_image = request.files['profile_image']
            destination = '/'.join([target,profile_image.filename])
            profile_image.save(destination)
            current_user.profile_image = profile_image.filename
            db.session.commit()
            status = True
            message = 'Successfully updated profile picture'
        except Exception as e:
            status = False
            message = str(e)
        return jsonify({
            'status':status,
            'message': message
        })

app.register_blueprint(settings, url_prefix='/settings')
