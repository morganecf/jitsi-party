import os
import json
import random
from .models import User, Room
from datetime import datetime
from flask import Blueprint, send_from_directory, redirect, url_for, current_app, request, jsonify

main = Blueprint('main', __name__)


@main.route('/join', methods=['GET', 'POST'])
def join():
    params = request.get_json()['params']
    user = User.create(**params)
    return jsonify(user.to_json())


@main.route('/config')
def get_config():
    rooms = current_app.config['ROOMS']
    adventures = current_app.config['ADVENTURES']
    for adventure in adventures.values():
        config = adventure.get('config', {})
        for node_name, adventure_node in adventure.items():
            if node_name != 'config':
                rooms[node_name] = {
                    'name': adventure_node.get('name', ''),
                    'type': 'adventure',
                    'text': adventure_node['text'],
                    'buttons': adventure_node['buttons'],
                    'audio': config.get('audio')
                }
                if adventure_node.get('map'):
                    rooms[node_name]['map'] = adventure_node['map']
    events = sorted(
        current_app.config['EVENTS'],
        key=lambda event: datetime.fromisoformat(event['start'])
    )
    config = {
        'rooms': rooms,
        'events': events
    }
    return jsonify(config)


@main.route('/', defaults={'path': ''})
@main.route('/<path:path>')
def serve(path):
    if path and not path.startswith('client'):
        return redirect(url_for('main.serve'))
    return send_from_directory(current_app.static_folder, 'index.html')


@main.route('/test_db_ping')
def test_db_ping():
    params = request.get_json()['params']
    user_id = User.query.first()
    room_id = random.choice(Room.query.all()).id
    User.enter_room(user_id, room_id)
