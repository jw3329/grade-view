from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from grade_view import db, app
from grade_view.models import User, UserSchema

settings = Blueprint('settings', __name__)

@settings.route('/profile',methods=['PUT'])
@login_required
def profile():
    profile_update_data = request.get_json()
    # print(profile_update_data)
    # user = User.query.get(current_user.id)
    try:
        current_user.first_name = profile_update_data['first_name']
        current_user.last_name = profile_update_data['last_name']
        current_user.bio = profile_update_data['bio']
        current_user.url = profile_update_data['url']
        current_user.company = profile_update_data['company']
        current_user.location = profile_update_data['location']
        current_user.profile = profile_update_data['profile']
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

app.register_blueprint(settings, url_prefix='/settings')
