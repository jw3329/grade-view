from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from grade_view import db, app
from grade_view.models import User, Course, GPA, Major

register = Blueprint('register', __name__)

@register.route('/gpa',methods=['GET','POST'])
@login_required
def profile():
    if request.method == 'GET':
        gpas = GPA.query.filter_by(user_id=current_user.id).all()
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
    elif request.method == 'POST':
        registered_data = request.get_json()
        print(registered_data)
        try:
            course = registered_data['course']
            course_number = registered_data['course_number']
            # handle course number if it is more than 3 digits
            if len(course_number) > 3: raise Exception('Invalid course number')
            gpa = registered_data['gpa']
            major_id = Major.query.filter_by(major=course).first().id
            course_data = Course.query.filter_by(major_id=major_id).filter_by(course_number=course_number).first()
            # if there's no filter result, then add it
            if not course_data:
                course_data = Course(major_id,course_number)
                db.session.add(course_data)
                db.session.commit()
            # after commit, add gpa data        
            grade_map = {
                'A+/A': 4.00,
                'A-': 3.67,
                'B+': 3.33,
                'B': 3.00,
                'B-': 2.67,
                'C+': 2.33,
                'C': 2.00,
                'C-': 1.67,
                'D+': 1.33,
                'D': 1.00,
                'D-': 0.67,
                'F': 0.00,
            }

            # handle error case if the grade does not belong to the category
            if gpa not in grade_map: raise Exception('Given grade does not belong to the grade map')
            gpa_data = GPA(current_user.id, course_data.id, grade_map[gpa])
            db.session.add(gpa_data)
            db.session.commit()
            status = True
            message = 'Successfully registered gpa information'
        except Exception as e:
            status = False
            message = str(e)
        return jsonify({
            'status':status,
            'message':message
        })

app.register_blueprint(register, url_prefix='/register')
