from flask import Blueprint, request, jsonify

api = Blueprint('api', __name__)

@api.route('/endpoint')
def endpoint():
    return jsonify('test')
