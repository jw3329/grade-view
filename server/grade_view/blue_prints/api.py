from flask import Blueprint, request, jsonify,send_file
from grade_view import db, app, UPLOAD_FOLDER
from grade_view.models import User, GPA, UserSchema,Follow
import os
from flask_login import login_required, current_user

api = Blueprint('api', __name__)

@api.route('/gpa',methods=['POST'])
def api_gpa():
    try:
        if request.method == 'POST':
            user = request.get_json()['user']
            gpas = GPA.query.filter_by(user_id=user['id']).all()
            json = {
                'status': True,
                'info': []
            }
            for gpa in gpas:
                course = gpa.course
                json['info'].append({
                    'course': course.major.major,
                    'course_number': course.course_number,
                    'gpa': gpa.gpa
                })
            return jsonify(json)
    except Exception as e:
        status = False
        message = str(e)
        return jsonify({'stauts':status, 'message':message})


@api.route('/find_user',methods=['POST'])
def api_find_user():
    try:
        if request.method == 'POST':
            username = request.get_json()['username']
            user = User.query.filter_by(username=username).first()
            if not user: raise Exception('No user found')
            json = {
                'status': True,
                'user': UserSchema().dump(user).data
            }
            return jsonify(json)
    except Exception as e:
        status = False
        message = str(e)
        return jsonify({'stauts':status, 'message':message})


@api.route('/profile_image/<filename>',methods=['GET'])
def api_profile_image(filename):
    target = f'{UPLOAD_FOLDER}/profile_images'
    if not os.path.isdir(target):
        os.mkdir(target)
    if request.method == 'GET':
        try:
            sending_file = os.path.abspath(f'{target}/{filename}')
            return send_file(sending_file,mimetype='image/jpg')
        except Exception as e:
            status = False
            message = str(e)
        return jsonify({
            'status':status,
            'message': message
        })

@api.route('/follow',methods=['POST'])
@login_required
def follow():
    if request.method == 'POST':
        try:
            data = request.get_json()
            destination_username = data['destination_username']
            user = User.query.filter_by(username=destination_username).first()
            if not user: raise Exception('No user found to follow')
            # find if current user is following the user or not
            follow = Follow.query.filter(Follow.source_id == current_user.id, Follow.destination_id == user.id).first()
            # if no data exists, follow the user, if it exists, then delete the follow data
            if not follow:
                db.session.add(Follow(current_user.id, user.id))
            else:
                db.session.delete(follow)
            db.session.commit()
            status = True
            message = None
        except Exception as e:
            status = False
            message = str(e)
        return jsonify({
            'status':status,
            'message': message
        })


@api.route('/get_followers',methods=['POST'])
@login_required
def get_followers():
    if request.method == 'POST':
        try:
            data = request.get_json()
            username = data['username']
            user = User.query.filter_by(username=username).first()
            if not user: raise Exception('No user found')
            # find if current user is following the user or not
            result_data = Follow.query.filter(Follow.destination_id == user.id).all()
            # if no data exists, follow the user, if it exists, then delete the follow data
            followers = []
            for follower_data in result_data:
                follower = User.query.get(follower_data.source_id)
                followers.append(follower.username)
            status = True
            message = None
        except Exception as e:
            status = False
            message = str(e)
        return jsonify({
            'status':status,
            'message': message,
            'followers': followers
        })


@api.route('/get_following_users',methods=['POST'])
@login_required
def get_following_users():
    if request.method == 'POST':
        try:
            data = request.get_json()
            username = data['username']
            user = User.query.filter_by(username=username).first()
            if not user: raise Exception('No user found')
            # find if current user is following the user or not
            result_data = Follow.query.filter(Follow.source_id == user.id).all()
            # if no data exists, follow the user, if it exists, then delete the follow data
            following_users = []
            for following_user_data in result_data:
                following_user = User.query.get(following_user_data.destination_id)
                following_users.append(following_user.username)
            status = True
            message = None
        except Exception as e:
            status = False
            message = str(e)
        return jsonify({
            'status':status,
            'message': message,
            'following_users': following_users
        })

app.register_blueprint(api, url_prefix='/api')
