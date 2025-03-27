from flask import Blueprint, jsonify
from .. import mongo

bp = Blueprint('main', __name__)

@bp.route('/', methods=['GET'])
def index():
    return jsonify({
        'message': 'Welcome to AgriTrendX API',
        'version': '1.0',
        'endpoints': {
            'health': '/health',
            'docs': '/docs'  # For future API documentation
        }
    })

@bp.route('/health', methods=['GET'])
def health_check():
    try:
        # Ping MongoDB to check connection
        mongo.db.command('ping')
        db_status = 'connected'
    except Exception as e:
        db_status = f'disconnected: {str(e)}'
    
    return jsonify({
        'status': 'healthy',
        'database': db_status
    }) 