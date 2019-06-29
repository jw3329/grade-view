from flask import Blueprint, request, abort, jsonify
from flask_login import LoginManager
from grade_view import db, app
from grade_view.models import User, UserSchema
import re

auth = Blueprint('auth', __name__)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)


@auth.route('/login')
def login():
    return 'Login'


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

        return jsonify({'status': True, 'user': UserSchema().dump(user).data})
    except Exception as e:
        return jsonify({'status': False, 'message': str(e)})


@auth.route('/logout')
def logout():
    return 'Logout'


app.register_blueprint(auth, url_prefix='/auth')