import os
import json
import copy
from . import mail
from .models import User
from datetime import datetime
from flask_mail import Message
from flask import Blueprint, send_from_directory, redirect, url_for, current_app, request, jsonify

main = Blueprint('main', __name__)


@main.route('/join', methods=['GET', 'POST'])
def join():
    params = request.get_json()['params']
    user = User.create(**params)
    return jsonify(user.to_json())


@main.route('/config')
def get_config():
    # Link adventures to rooms
    rooms = copy.deepcopy(current_app.config['ROOMS'])
    adventures = copy.deepcopy(current_app.config['ADVENTURES'])
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
    # Add image map options to image map rooms
    image_maps = current_app.config['IMAGE_MAPS']
    for room in rooms.values():
        image_map = room.get('imageMapOptions')
        if room['type'] == 'imagemap' and image_map in image_maps:
            room['imageMapOptions'] = image_maps[image_map]
    config = {
        'rooms': rooms,
        'events': events
    }
    return jsonify(config)


@main.route('/email_moderators', methods=['POST'])
def email_moderators():
    params = request.get_json()['params']
    moderators = current_app.config['MODERATOR_EMAILS']
    sender = current_app.config['MAIL_USERNAME']
    message = Message(
        'Jitsi Party Alert',
        sender=sender,
        recipients=moderators
    )
    formatted_message = ''.join(
        ['<p>{0}</p>'.format(paragraph) for paragraph in params['message'].split('\n')]
    )
    message.html = '''
        <b>The following message was sent via the moderator contact form:</b>
        <blockquote>{0}</blockquote>
        <br>
        <b>Sender details</b>
        <div>Username: {1}</div>
        <div>User ID: {2}</div>
        <div>Email: {3}</div>
    '''.format(
        formatted_message,
        params['user']['username'],
        params['user']['id'],
        params['email'] if params.get('email') else 'Not provided'
    )
    mail.send(message)
    return jsonify('message sent')


@main.route('/', defaults={'path': ''})
@main.route('/<path:path>')
def serve(path):
    if path and not path.startswith('client'):
        return redirect(url_for('main.serve'))
    return send_from_directory(current_app.static_folder, 'index.html')
