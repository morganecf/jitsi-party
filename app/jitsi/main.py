from functools import wraps
from flask import Flask, send_from_directory, redirect, url_for, Blueprint, current_app

main = Blueprint('main', __name__)

@main.route('/', defaults={'path': ''})
@main.route('/<path:path>')
def serve(path):
    if path and not path.startswith('client'):
        return redirect(url_for('main.serve'))
    return send_from_directory(current_app.static_folder, 'index.html')
