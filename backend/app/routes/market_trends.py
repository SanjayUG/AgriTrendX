from flask import Blueprint, jsonify, request
from datetime import datetime
from ..models.market_trends import MarketTrends

bp = Blueprint('market_trends', __name__, url_prefix='/api/v1/market')

@bp.route('/prices', methods=['GET'])
def get_crop_prices():
    crop_name = request.args.get('crop')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    if start_date:
        start_date = datetime.strptime(start_date, '%Y-%m-%d')
    if end_date:
        end_date = datetime.strptime(end_date, '%Y-%m-%d')
    
    result = MarketTrends.get_crop_prices(crop_name, start_date, end_date)
    return jsonify(result)

@bp.route('/demand/predict', methods=['GET'])
def predict_demand():
    crop_name = request.args.get('crop')
    prediction_period = request.args.get('period', default=30, type=int)
    
    if not crop_name:
        return jsonify({
            'success': False,
            'error': 'Crop name is required'
        }), 400
    
    result = MarketTrends.predict_demand(crop_name, prediction_period)
    return jsonify(result)

@bp.route('/prices', methods=['POST'])
def add_price_data():
    data = request.get_json()
    
    if not data:
        return jsonify({
            'success': False,
            'error': 'No data provided'
        }), 400
    
    # Add current timestamp if not provided
    if 'date' not in data:
        data['date'] = datetime.utcnow()
    
    result = MarketTrends.add_price_data(data)
    return jsonify(result)