from .database import create_user, get_all_active_users, get_active_users_for_room
from flask import Blueprint, send_from_directory, redirect, url_for, current_app, request, jsonify

main = Blueprint('main', __name__)

@main.route('/join', methods=['GET', 'POST'])
def join():
    params = request.get_json()['params']
    user = create_user(**params)
    return jsonify(user.to_json())

@main.route('/users/<room>')
def get_users(room):
    return jsonify(list(get_active_users_for_room(room)))

@main.route('/users')
def get_all_users():
    return jsonify(list(get_all_active_users()))

@main.route('/', defaults={'path': ''})
@main.route('/<path:path>')
def serve(path):
    if path and not path.startswith('client'):
        return redirect(url_for('main.serve'))
    return send_from_directory(current_app.static_folder, 'index.html')
