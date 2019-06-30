from flask_sqlalchemy import SQLAlchemy
from grade_view import app, db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_marshmallow import Marshmallow
from flask_login import UserMixin

ma = Marshmallow(app)


class User(db.Model,UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), unique=True, nullable=False)
    first_name = db.Column(db.String(30), nullable=False)
    last_name = db.Column(db.String(30), nullable=False)
    hashed_password = db.Column(db.String(100), nullable=False)
    profile = db.Column(db.String(100),
                        nullable=False,
                        default='default.jpg')
    created_date = db.Column(db.DateTime,
                             nullable=False,
                             default=datetime.utcnow)

    def __init__(self, email, first_name, last_name, password):
        self.email = email
        self.first_name = first_name
        self.last_name = last_name
        self.hashed_password = self.set_password(password)

    def set_password(self, password):
        return generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.hashed_password, password)

    def __repr__(self):
        return f'<User {self.email}, {self.first_name}, {self.last_name}, {self.profile}>'


class UserSchema(ma.Schema):
    class Meta:
        fields = ('id', 'email', 'first_name', 'last_name', 'profile',
                  'created_date')


class Major(db.Model):
    __tablename__ = 'majors'
    id = db.Column(db.Integer, primary_key=True)
    major = db.Column(db.String(30), unique=True)

    def __init__(self, major):
        self.major = major

    def __repr__(self):
        return f'<Major {self.major}>'

class MajorSchema(ma.Schema):
    class Meta:
        fields = ['major']


class MajorUserRelationship(db.Model):
    __tablename__ = 'major_user_relationships'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User', backref='majors', lazy=True)
    major_id = db.Column(db.Integer,
                         db.ForeignKey('majors.id'),
                         nullable=False)
    major = db.relationship('Major', backref='users', lazy=True)

    def __init__(self, user_id, major_id):
        self.user_id = user_id
        self.major_id = major_id

    def __repr__(self):
        return f'<MajorUserRelationship {self.user}, {self.major}>'