from flask import Blueprint, jsonify, request
from .data_loader import DataLoader

api = Blueprint('api', __name__)
data_loader = DataLoader()

# Ensure dataset is downloaded on startup
data_loader.download_dataset()

@api.route('/market-trends/<commodity>/<state>')
def get_market_trends(commodity, state):
    """Get market trends data for a specific commodity and state"""
    try:
        result = data_loader.load_market_trends(commodity, state)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/market-summary/<commodity>')
def get_market_summary(commodity):
    """Get market summary for a commodity across multiple states"""
    try:
        states = request.args.getlist('states[]')
        if not states:
            return jsonify({'error': 'No states provided'}), 400
            
        result = data_loader.get_market_summary(commodity, states)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500