from flask import Blueprint, request, jsonify
from flask_login import LoginManager, login_user, current_user, login_required,logout_user
from grade_view import db, app
from grade_view.models import User, UserSchema, Major, MajorSchema, MajorUserRelationship
import re

auth = Blueprint('auth', __name__)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@auth.route('/authenticated')
def authenticated():
    return jsonify({
        'status': current_user.is_authenticated,
        'user': UserSchema().dump(current_user).data if current_user.is_authenticated else None
    })


@auth.route('/signin', methods=['POST'])
def login():
    content = request.get_json()
    email = content['email']
    password = content['password']
    try:
        user = User.query.filter_by(email=email).first()
        if not user:
            raise Exception('Email does not exists')
        if not user.check_password(password):
            raise Exception('Password does not match')
        print(current_user)
        if current_user.is_authenticated:
            raise Exception('User is already logged in')
        login_user(user)
        return jsonify({
            'status': True,
            'user': UserSchema().dump(user).data
        })
    except Exception as e:
        return jsonify({
            'status': False,
            'message': str(e)
        })


@auth.route('/majors')
def get_majors():
    major_list = []
    for major in Major.query.all():
        major_list.append(major.major)
    return jsonify({
        'status': True,
        'majors': major_list
    })


@auth.route('/signup', methods=['POST'])
def signup():
    content = request.get_json()
    try:
        if content['password'] != content['confirm_password']:
            raise Exception('Password and confirm password does not match')
        if not re.match(
                r'^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$',
                content['email']):
            raise Exception('Not a valid email form')
        if User.query.filter_by(email=content['email']).first():
            raise Exception('Email already exists')
        user = User(content['email'], content['firstname'],
                    content['lastname'], content['password'])
        db.session.add(user)
        db.session.commit()
        # put into MajorUserRelationship object to add in database
        for major in content['majors']:
            db.session.add(MajorUserRelationship(
                user.id, Major.query.filter_by(major=major).first().id))
        db.session.commit()

        return jsonify({'status': True, 'user': UserSchema().dump(user).data})
    except Exception as e:
        return jsonify({'status': False, 'message': str(e)})


@auth.route('/signout')
def logout():
    if current_user.is_authenticated:
        logout_user()
        return jsonify({
        'status': True,
        'message': 'Successfully logged out'
    })
    else:
        return jsonify({
        'status': False,
        'message': 'User is not authenticated'
    })



app.register_blueprint(auth, url_prefix='/auth')
