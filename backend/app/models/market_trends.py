from datetime import datetime
from .. import mongo

class MarketTrends:
    @staticmethod
    def get_crop_prices(crop_name=None, start_date=None, end_date=None):
        query = {}
        if crop_name:
            query['crop_name'] = crop_name
        if start_date and end_date:
            query['date'] = {
                '$gte': start_date,
                '$lte': end_date
            }
        
        try:
            prices = list(mongo.db.crop_prices.find(query))
            return {'success': True, 'data': prices}
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    @staticmethod
    def predict_demand(crop_name, prediction_period=30):
        try:
            # Get historical data for demand prediction
            historical_data = list(mongo.db.crop_demand.find(
                {'crop_name': crop_name}
            ).sort('date', -1).limit(90))  # Last 90 days of data
            
            # TODO: Implement AI model for demand prediction
            # For now, return placeholder prediction
            prediction = {
                'crop_name': crop_name,
                'predicted_demand': 'high',  # Will be replaced with actual prediction
                'confidence_score': 0.85,
                'prediction_date': datetime.utcnow(),
                'prediction_period': prediction_period
            }
            
            return {'success': True, 'data': prediction}
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    @staticmethod
    def add_price_data(data):
        try:
            if not all(key in data for key in ['crop_name', 'price', 'date']):
                return {'success': False, 'error': 'Missing required fields'}
            
            result = mongo.db.crop_prices.insert_one(data)
            return {'success': True, 'id': str(result.inserted_id)}
        except Exception as e:
            return {'success': False, 'error': str(e)}