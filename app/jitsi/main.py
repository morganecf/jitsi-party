import os
import json
from .models import User
from flask import Blueprint, send_from_directory, redirect, url_for, current_app, request, jsonify

main = Blueprint('main', __name__)

@main.route('/join', methods=['GET', 'POST'])
def join():
    params = request.get_json()['params']
    user = User.create(**params)
    return jsonify(user.to_json())

@main.route('/users')
def get_users():
    # NOTE uncomment this to test map with mock data
    # basedir = current_app.config.get('BASE_DIR')
    # users = json.load(open(os.path.join(basedir, 'mock_map_data.json')))['data']
    # return jsonify(users)
    return jsonify(User.get_active_users_by_room())

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
