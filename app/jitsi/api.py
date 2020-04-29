from .database import create_user
from flask import Blueprint, request, jsonify

api = Blueprint('api', __name__)

@api.route('/join', methods=['GET', 'POST'])
def join():
    params = request.get_json()['params']
    user = create_user(**params)
    return jsonify(user.to_json())
