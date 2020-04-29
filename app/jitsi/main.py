import time
from threading import Thread
from .database import create_user, update_stale_users
from flask import Flask, send_from_directory, redirect, url_for, Blueprint, current_app, request, jsonify

main = Blueprint('main', __name__)

@main.before_app_first_request
def before_first_request():
    print('starting thread')

    '''Start a background thread that marks stale users as offline'''
    def find_offline_users(app):
        with app.app_context():
            while True:
                update_stale_users()
                time.sleep(10)

    thread = Thread(target=find_offline_users, args=(current_app._get_current_object(),))
    thread.start()

@main.route('/join', methods=['GET', 'POST'])
def join():
    params = request.get_json()['params']
    user = create_user(**params)
    return jsonify(user.to_json())

@main.route('/', defaults={'path': ''})
@main.route('/<path:path>')
def serve(path):
    if path and not path.startswith('client'):
        return redirect(url_for('main.serve'))
    return send_from_directory(current_app.static_folder, 'index.html')
