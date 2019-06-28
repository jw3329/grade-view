from flask_sqlalchemy import SQLAlchemy
from grade_view.setup import app
db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), unique=True, nullable=False)
    first_name = db.Column(db.String(30), unique=True, nullable=False)
    last_name = db.Column(db.String(30), unique=True, nullable=False)
    password = db.Column(db.String(100), unique=True, nullable=False)
    profile = db.Column(db.String(100), unique=True, nullable=False)
    # major = db.relationship('MajorUserRelationship', backref='users', lazy=True)

    def __init__(self, email, first_name, last_name, password, profile):
        self.email = email
        self.first_name = first_name
        self.last_name = last_name
        self.password = password
        self.profile = profile

    def __repr__(self):
        return f'<User {self.email}, {self.first_name}, {self.last_name}, {self.profile}>'

class Major(db.Model):
    __tablename__ = 'majors'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), unique=True)

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return f'<Major {self.name}>'

class MajorUserRelationship(db.Model):
    __tablename__ = 'major_user_relationships'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User', backref='majors', lazy=True)
    major_id = db.Column(db.Integer, db.ForeignKey('majors.id'), nullable=False)
    major = db.relationship('Major', backref='users', lazy=True)

    def __init__(self, user_id, major_id):
        self.user_id = user_id
        self.major_id = major_id
    def __repr__(self):
        return f'<MajorUserRelationship {self.user}, {self.major}>'

db.create_all()