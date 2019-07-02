from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from grade_view import db, app
from grade_view.models import User, UserSchema

settings = Blueprint('settings', __name__)

@settings.route('/profile',methods=['PUT'])
@login_required
def profile():
    profile_update_data = request.get_json()
    user = User.query.get(current_user.id)
    try:
        user.first_name = profile_update_data['first_name']
        user.last_name = profile_update_data['last_name']
        user.bio = profile_update_data['bio']
        user.url = profile_update_data['url']
        user.company = profile_update_data['company']
        user.location = profile_update_data['location']
        user.profile = profile_update_data['profile']
        db.session.commit()
        status = True
        message = 'Successfully updated'
    except Exception as e:
        status = False
        message = str(e)
    return jsonify({
        'status':status,
        'message':message,
        'user': UserSchema().dump(user).data
    })

app.register_blueprint(settings, url_prefix='/settings')
