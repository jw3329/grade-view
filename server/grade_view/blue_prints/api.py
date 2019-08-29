from flask import Blueprint, request, jsonify
from grade_view import db, app
from grade_view.models import User, GPA, UserSchema

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
            json = {
                'status': True,
                'user': UserSchema().dump(user).data
            }
            return jsonify(json)
    except Exception as e:
        status = False
        message = str(e)
        return jsonify({'stauts':status, 'message':message})

app.register_blueprint(api, url_prefix='/api')
