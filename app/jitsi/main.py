import os
import json
from .models import User
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
    # Merge adventures into rooms
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
    # Sort events by start time
    events = sorted(
        current_app.config['EVENTS'],
        key=lambda event: datetime.fromisoformat(event['start'])
    )
    # Merge any existing event notifications into notifications
    notifications = current_app.config['NOTIFICATIONS']
    notifications['toast'] = notifications.get('toast', [])
    notifications['audio'] = notifications.get('audio', [])
    notifications['modal'] = notifications.get('modal', [])
    for event in events:
        if event.get('notifications'):
            notifications['toast'].extend(event['notifications'])
        elif event.get('audioNotifications'):
            notifications['audio'].extend(event['audioNotifications'])
    config = {
        'rooms': rooms,
        'events': events,
        'notifications': notifications
    }
    return jsonify(config)

@main.route('/', defaults={'path': ''})
@main.route('/<path:path>')
def serve(path):
    if path and not path.startswith('client'):
        return redirect(url_for('main.serve'))
    return send_from_directory(current_app.static_folder, 'index.html')
