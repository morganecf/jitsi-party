import os
import json
import copy
import logging
import subprocess
from . import mail
from .models import User
from datetime import datetime
from twilio.rest import Client
from flask import Blueprint, render_template, redirect, url_for, current_app, request, jsonify

main = Blueprint('main', __name__)
logger = logging.getLogger(__name__)

@main.route('/join', methods=['GET', 'POST'])
def join():
    num_proxies = current_app.config['NUM_PROXIES']
    params = request.get_json()['params']
    params['ip'] = compute_ip(num_proxies)
    user = User.create(**params)
    return jsonify(user.to_json())


@main.route('/config')
def get_config():
    # Link adventures to rooms
    rooms = copy.deepcopy(current_app.config['ROOMS'])
    adventures = copy.deepcopy(current_app.config['ADVENTURES'])
    for adventure in adventures:
        config = adventure.get('config', {})
        for node_name, adventure_node in adventure.items():
            if node_name != 'config':
                rooms[node_name] = {
                    'name': adventure_node.get('name', ''),
                    'type': 'ADVENTURE',
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
        if room['type'] == 'IMAGEMAP' and image_map in image_maps:
            room['imageMapOptions'] = image_maps[image_map]
    config = {
        'rooms': rooms,
        'events': events
    }
    return jsonify(config)

@main.route('/text_moderator', methods=['POST'])
def text_moderators():
    params = request.get_json()['params']
    user = params['user']

    moderator = current_app.config['MODERATOR_NUMBER']
    sender = current_app.config['TWILIO_NUMBER']
    account_sid = current_app.config['TWILIO_ACCOUNT_SID']
    auth_token = current_app.config['TWILIO_AUTH_TOKEN']

    message = '''

    The following message was sent via the moderator contact form:
    {0}

    Sender details:
    Username: {1}
    User ID: {2}
    Email: {3}
    '''.format(
        params['message'],
        user['username'],
        user['id'],
        params['email']
    )

    log_msg = 'User {0} (id={1}; email={2}) is sending message: {3}'.format(
        user['username'],
        user['id'],
        params['email'],
        params['message']
    )
    logger.warn(log_msg)

    # Ugh
    subprocess.call([
        'python3',
        'send_text.py',
        account_sid,
        auth_token,
        sender,
        moderator,
        message
    ])

    return jsonify('text sent')


@main.route('/email_moderators', methods=['POST'])
def email_moderators():
    params = request.get_json()['params']
    user = params['user']
    moderators = current_app.config['MODERATOR_EMAILS']
    sender = current_app.config['MAIL_USERNAME']
    password = current_app.config['MAIL_PASSWORD']
    formatted_message = ''.join(
        ['<p>{0}</p>'.format(paragraph) for paragraph in params['message'].split('\n')]
    )
    html = '''
        <b>The following message was sent via the moderator contact form:</b>
        <blockquote>{0}</blockquote>
        <br>
        <b>Sender details</b>
        <div>Username: {1}</div>
        <div>User ID: {2}</div>
        <div>Email: {3}</div>
    '''.format(
        formatted_message,
        user['username'],
        user['id'],
        params['email']
    )
    # Ugh
    log_msg = 'User {0} (id={1}; email={2}) is sending message: {3}'.format(
        user['username'],
        user['id'],
        params['email'],
        params['message']
    )
    logger.warn(log_msg)
    subprocess.call([
        'python3',
        'send_email.py',
        sender,
        password,
        moderators[0],
        html
    ])
    return jsonify('message sent')


@main.route('/', defaults={'path': ''})
@main.route('/<path:path>')
def serve(path):
    if path and not path.startswith('client'):
        return redirect(url_for('main.serve'))
    return render_template('index.html', config = current_app.config)


def compute_ip(num_proxies=0):
    headers_list = request.headers.getlist("X-Forwarded-For")
    if (num_proxies <= 0) or not headers_list:
        return request.remote_addr
    else:
        return headers_list[-1 * num_proxies]

