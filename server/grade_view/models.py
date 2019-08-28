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
    profile_image = db.Column(db.String(100),
                        nullable=False,
                        default='')
    bio = db.Column(db.Text,nullable=False, default='')
    url = db.Column(db.String(50),nullable=False, default='')
    company = db.Column(db.String(30), nullable=False, default='')
    location = db.Column(db.String(30), nullable=False, default='')

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
        return f'<User {self.email}, {self.first_name}, {self.last_name}, {self.profile_image}>'


class UserSchema(ma.Schema):
    class Meta:
        fields = ('id', 'email', 'first_name', 'last_name', 'profile_image', 'bio', 'url', 'company', 'location','created_date')


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

class Course(db.Model):
    __tablename__ = 'courses'
    id = db.Column(db.Integer, primary_key=True)
    major_id = db.Column(db.Integer, db.ForeignKey('majors.id'), nullable=False)
    major = db.relationship('Major', backref='courses', lazy=True)
    course_number = db.Column(db.Integer, nullable=False)

    def __init__(self, major_id, course_number):
        self.major_id = major_id
        self.course_number = course_number

    def __repr__(self):
        return f'<Course {self.major}, {self.course_number}>'

class GPA(db.Model):
    __tablename__ = 'gpas'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User',backref='gpas', lazy=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    course = db.relationship('Course',backref='gpas', lazy=True)
    gpa = db.Column(db.Float, nullable=False)

    def __init__(self, user_id, course_id, gpa):
        self.user_id = user_id
        self.course_id = course_id
        self.gpa = gpa

    def __repr__(self):
        return f'<GPA {self.user_id}, {self.course_id}, {self.gpa}>'


class Professor(db.Model):
    __tablename__ = 'professors'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(30), nullable=False)
    last_name = db.Column(db.String(30), nullable=False)

    def __init__(self, first_name, last_name):
        self.first_name = first_name
        self.last_name = last_name

    def __repr__(self):
        return f'<Professor {self.first_name}, {self.last_name}>'

class ProfessorCourses(db.Model):
    __tablename__ = 'professor_courses'
    id = db.Column(db.Integer, primary_key=True)
    professor_id = db.Column(db.Integer, db.ForeignKey('professors.id'), nullable=False)
    professor = db.relationship('Professor', backref='professor_courses',lazy=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    course = db.relationship('Course', backref='professor_courses',lazy=True)

    def __init__(self, professor_id, course_id):
        self.professor_id = professor_id
        self.course_id = course_id

    def __repr__(self):
        return f'<ProfessorCourses {self.professor_id}, {self.course_id}>'