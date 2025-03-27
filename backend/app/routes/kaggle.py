from flask import Blueprint, jsonify, request
from ..kaggle.service import KaggleService

bp = Blueprint('kaggle', __name__)
kaggle_service = KaggleService()

@bp.route('/datasets', methods=['GET'])
def list_datasets():
    try:
        search_query = request.args.get('search')
        sort_by = request.args.get('sort_by', 'hottest')
        max_size = int(request.args.get('max_size', 10))
        
        datasets = kaggle_service.list_datasets(search_query, sort_by, max_size)
        return jsonify({'datasets': datasets})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/datasets/<path:dataset_ref>', methods=['GET'])
def get_dataset(dataset_ref):
    try:
        metadata = kaggle_service.get_dataset_metadata(dataset_ref)
        return jsonify(metadata)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/datasets/<path:dataset_ref>/download', methods=['POST'])
def download_dataset(dataset_ref):
    try:
        path = kaggle_service.download_dataset(dataset_ref)
        return jsonify({'message': 'Dataset downloaded successfully', 'path': path})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/competitions', methods=['GET'])
def list_competitions():
    try:
        category = request.args.get('category')
        sort_by = request.args.get('sort_by', 'latestDeadline')
        max_size = int(request.args.get('max_size', 10))
        
        competitions = kaggle_service.list_competitions(category, sort_by, max_size)
        return jsonify({'competitions': competitions})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/competitions/<competition_id>', methods=['GET'])
def get_competition(competition_id):
    try:
        metadata = kaggle_service.get_competition_metadata(competition_id)
        return jsonify(metadata)
    except Exception as e:
        return jsonify({'error': str(e)}), 500 