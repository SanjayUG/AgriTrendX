from flask import Blueprint, jsonify, request
from ..kaggle.service import KaggleService
from ..models.forecasting.service import MarketForecastingService
from ..models.forecasting.pretrained_model import PretrainedForecastingModel
import pandas as pd
import os

bp = Blueprint('forecasting', __name__)
kaggle_service = KaggleService()
forecasting_service = MarketForecastingService()
forecasting_model = PretrainedForecastingModel()

@bp.route('/datasets/agricultural', methods=['GET'])
def get_agricultural_datasets():
    try:
        commodity = request.args.get('commodity')
        max_size = int(request.args.get('max_size', 20))
        datasets = kaggle_service.search_agricultural_datasets(commodity, max_size)
        return jsonify({'datasets': datasets})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/analyze', methods=['POST'])
def analyze_market():
    try:
        # Get parameters from request
        data = request.json
        commodity = data.get('commodity')
        state = data.get('state')
        district = data.get('district')
        dataset_ref = data.get('dataset_ref')
        target_column = data.get('target_column')
        
        if not all([commodity, state, dataset_ref]):
            return jsonify({'error': 'Missing required parameters'}), 400
        
        # Download and prepare dataset
        result = kaggle_service.download_and_prepare_dataset(dataset_ref)
        dataset_path = result['path']
        
        # Find the main data file
        data_files = [f for f in os.listdir(dataset_path) if f.endswith(('.csv', '.xlsx'))]
        if not data_files:
            return jsonify({'error': 'No data files found in dataset'}), 400
            
        # Read the first data file
        data_file = data_files[0]
        file_path = os.path.join(dataset_path, data_file)
        
        if data_file.endswith('.csv'):
            df = pd.read_csv(file_path)
        else:
            df = pd.read_excel(file_path)
        
        # Filter data by commodity and location
        df = kaggle_service.filter_data_by_commodity(df, commodity)
        df = kaggle_service.filter_data_by_location(df, state, district)
        
        if len(df) == 0:
            return jsonify({'error': 'No data found for the specified criteria'}), 404
            
        # Get target column if not specified
        if not target_column:
            numeric_columns = df.select_dtypes(include=['float64', 'int64']).columns
            if len(numeric_columns) > 0:
                target_column = numeric_columns[0]
            else:
                return jsonify({'error': 'No numeric columns found in dataset'}), 400
        
        # Generate graph data
        graph_data = forecasting_service.generate_graph_data(df, target_column)
        
        # Generate forecast graph
        forecast_data = forecasting_service.generate_forecast_graph(df, target_column)
        
        # Analyze market trends
        analysis = forecasting_service.analyze_market_trends(df, target_column)
        
        return jsonify({
            'analysis': analysis,
            'graph_data': graph_data,
            'forecast_data': forecast_data,
            'metadata': {
                'commodity': commodity,
                'state': state,
                'district': district,
                'data_points': len(df)
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/forecast', methods=['POST'])
def forecast_prices():
    try:
        # Get parameters from request
        data = request.json
        commodity = data.get('commodity')
        days = int(data.get('days', 30))
        
        if not commodity:
            return jsonify({'error': 'Commodity is required'}), 400
        
        # Generate forecast using pre-trained model
        result = forecasting_model.generate_forecast(commodity, days)
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/commodities', methods=['GET'])
def list_commodities():
    """
    List all available commodities that have pre-trained models
    """
    try:
        import os
        model_path = os.path.join('models', 'pretrained')
        if not os.path.exists(model_path):
            return jsonify({'commodities': []})
            
        # Get list of available models
        models = [f.replace('_model.h5', '') for f in os.listdir(model_path) if f.endswith('_model.h5')]
        
        return jsonify({
            'commodities': models,
            'count': len(models)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500 