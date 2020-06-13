import os
import json
from .s3 import Bucket
from .events import broadcast_state
from .models import User, GuestbookEntry
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


@main.route('/uploadphoto', methods=['POST'])
def upload_photo():
    photo = request.files.get('photo')
    folder = request.form.get('folder')
    note = request.form.get('note')
    user_id = request.form.get('userId')
    name = photo.filename
    # Upload image to s3 bucket folder
    bucket = Bucket(current_app.config['S3_BUCKET'])
    response = bucket.upload_photo(photo.read(), name, folder)
    # Save bucket URL to db
    if response.get('url'):
        GuestbookEntry.create(user_id, folder, note, response['url'])
        broadcast_state()
    return jsonify(response)


@main.route('/', defaults={'path': ''})
@main.route('/<path:path>')
def serve(path):
    if path and not path.startswith('client'):
        return redirect(url_for('main.serve'))
    return send_from_directory(current_app.static_folder, 'index.html')
