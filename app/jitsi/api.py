from flask import Blueprint, request, jsonify

api = Blueprint('api', __name__)

@api.route('/rooms')
def rooms():
    return jsonify('rooms')

@api.route('/keepalive')
def keepalive():
    return jsonify('keepalive')

