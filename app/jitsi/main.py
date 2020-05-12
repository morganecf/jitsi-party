import os
import json
from .models import User
from flask import Blueprint, send_from_directory, redirect, url_for, current_app, request, jsonify

main = Blueprint('main', __name__)

@main.route('/join', methods=['GET', 'POST'])
def join():
    params = request.get_json()['params']
    params['ip'] = computeIp()
    user = User.create(**params)
    return jsonify(user.to_json())

@main.route('/rooms')
def get_rooms():
    basedir = current_app.config.get('BASE_DIR')
    rooms = json.load(open(os.path.join(basedir, 'rooms.json')))
    adventures = json.load(open(os.path.join(basedir, 'adventures.json')))
    for adventure in adventures.values():
        for node_name, adventure_node in adventure.items():
            rooms[node_name] = {
                'name': adventure_node.get('name', ''),
                'type': 'adventure',
                'text': adventure_node['text'],
                'buttons': adventure_node['buttons']
            }
            if adventure_node.get('map'):
                rooms[node_name]['map'] = adventure_node['map']
    return jsonify(rooms)

@main.route('/', defaults={'path': ''})
@main.route('/<path:path>')
def serve(path):
    if path and not path.startswith('client'):
        return redirect(url_for('main.serve'))
    return send_from_directory(current_app.static_folder, 'index.html')


def computeIp():
    headers_list = request.headers.getlist("X-Forwarded-For")
    # using the 0th index of headers_list is dangerous for stuff explained here: http://esd.io/blog/flask-apps-heroku-real-ip-spoofing.html 
    # TODO find a way to make this ALWAYS get client IP
    user_ip = headers_list[0] if headers_list else request.remote_addr 
    return user_ip

