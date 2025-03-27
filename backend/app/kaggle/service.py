import os
import json
from kaggle.api.kaggle_api_extended import KaggleApi
from typing import List, Dict, Any
import pandas as pd

class KaggleService:
    def __init__(self):
        self.api = KaggleApi()
        self.api.authenticate()

    def filter_data_by_location(self, df: pd.DataFrame, state: str = None, district: str = None) -> pd.DataFrame:
        """
        Filter dataset by state and district
        """
        try:
            # Convert column names to lowercase for case-insensitive matching
            df.columns = df.columns.str.lower()
            
            # Check for state column variations
            state_columns = ['state', 'state_name', 'state_name_english', 'state_name_en']
            state_col = next((col for col in state_columns if col in df.columns), None)
            
            # Check for district column variations
            district_columns = ['district', 'district_name', 'district_name_english', 'district_name_en']
            district_col = next((col for col in district_columns if col in df.columns), None)
            
            if state and state_col:
                df = df[df[state_col].str.lower() == state.lower()]
            
            if district and district_col:
                df = df[df[district_col].str.lower() == district.lower()]
            
            return df
        except Exception as e:
            raise Exception(f"Error filtering data by location: {str(e)}")

    def filter_data_by_commodity(self, df: pd.DataFrame, commodity: str) -> pd.DataFrame:
        """
        Filter dataset by commodity
        """
        try:
            # Convert column names to lowercase for case-insensitive matching
            df.columns = df.columns.str.lower()
            
            # Check for commodity column variations
            commodity_columns = ['commodity', 'crop', 'crop_name', 'crop_name_english', 'crop_name_en']
            commodity_col = next((col for col in commodity_columns if col in df.columns), None)
            
            if commodity and commodity_col:
                df = df[df[commodity_col].str.lower() == commodity.lower()]
            
            return df
        except Exception as e:
            raise Exception(f"Error filtering data by commodity: {str(e)}")

    def search_agricultural_datasets(self, commodity: str = None, max_size: int = 20) -> List[Dict[str, Any]]:
        """
        Search for agricultural datasets specifically
        """
        try:
            # Search for agricultural datasets
            search_query = 'agriculture crop price market'
            if commodity:
                search_query += f' {commodity}'
                
            datasets = self.api.dataset_list(
                search=search_query,
                sort_by='hottest',
                max_size=max_size
            )
            
            # Filter and format results
            agricultural_datasets = []
            for dataset in datasets:
                if any(tag in dataset.tags for tag in ['agriculture', 'crop', 'food', 'market']):
                    agricultural_datasets.append({
                        'ref': dataset.ref,
                        'title': dataset.title,
                        'description': dataset.description,
                        'size': dataset.size,
                        'lastUpdated': dataset.lastUpdated,
                        'downloadCount': dataset.downloadCount,
                        'voteCount': dataset.voteCount,
                        'tags': dataset.tags
                    })
            return agricultural_datasets
        except Exception as e:
            raise Exception(f"Error searching agricultural datasets: {str(e)}")

    def list_datasets(self, search_query: str = None, sort_by: str = 'hottest', max_size: int = 10) -> List[Dict[str, Any]]:
        """
        List Kaggle datasets based on search criteria
        """
        try:
            datasets = self.api.dataset_list(search=search_query, sort_by=sort_by, max_size=max_size)
            return [{
                'ref': dataset.ref,
                'title': dataset.title,
                'size': dataset.size,
                'lastUpdated': dataset.lastUpdated,
                'downloadCount': dataset.downloadCount,
                'voteCount': dataset.voteCount
            } for dataset in datasets]
        except Exception as e:
            raise Exception(f"Error fetching datasets: {str(e)}")

    def get_dataset_metadata(self, dataset_ref: str) -> Dict[str, Any]:
        """
        Get metadata for a specific dataset
        """
        try:
            dataset = self.api.dataset_get(dataset_ref)
            return {
                'ref': dataset.ref,
                'title': dataset.title,
                'description': dataset.description,
                'size': dataset.size,
                'lastUpdated': dataset.lastUpdated,
                'downloadCount': dataset.downloadCount,
                'voteCount': dataset.voteCount,
                'tags': dataset.tags,
                'license': dataset.licenseName
            }
        except Exception as e:
            raise Exception(f"Error fetching dataset metadata: {str(e)}")

    def download_dataset(self, dataset_ref: str, path: str = None) -> str:
        """
        Download a dataset
        """
        try:
            if path is None:
                path = os.path.join('outputs', 'datasets', dataset_ref.replace('/', '_'))
            
            os.makedirs(path, exist_ok=True)
            self.api.dataset_download_files(dataset_ref, path=path, unzip=True)
            return path
        except Exception as e:
            raise Exception(f"Error downloading dataset: {str(e)}")

    def list_competitions(self, category: str = None, sort_by: str = 'latestDeadline', max_size: int = 10) -> List[Dict[str, Any]]:
        """
        List Kaggle competitions
        """
        try:
            competitions = self.api.competitions_list(category=category, sort_by=sort_by, max_size=max_size)
            return [{
                'id': comp.id,
                'title': comp.title,
                'category': comp.category,
                'deadline': comp.deadline,
                'reward': comp.reward,
                'teamCount': comp.teamCount,
                'userHasEntered': comp.userHasEntered
            } for comp in competitions]
        except Exception as e:
            raise Exception(f"Error fetching competitions: {str(e)}")

    def get_competition_metadata(self, competition_id: str) -> Dict[str, Any]:
        """
        Get metadata for a specific competition
        """
        try:
            competition = self.api.competition_get(competition_id)
            return {
                'id': competition.id,
                'title': competition.title,
                'description': competition.description,
                'category': competition.category,
                'deadline': competition.deadline,
                'reward': competition.reward,
                'teamCount': competition.teamCount,
                'userHasEntered': competition.userHasEntered,
                'metric': competition.metric,
                'tags': competition.tags
            }
        except Exception as e:
            raise Exception(f"Error fetching competition metadata: {str(e)}")

    def download_and_prepare_dataset(self, dataset_ref: str) -> Dict[str, Any]:
        """
        Download and prepare a dataset for analysis
        """
        try:
            # Download the dataset
            path = self.download_dataset(dataset_ref)
            
            # Get dataset metadata
            metadata = self.get_dataset_metadata(dataset_ref)
            
            return {
                'path': path,
                'metadata': metadata,
                'status': 'success'
            }
        except Exception as e:
            raise Exception(f"Error preparing dataset: {str(e)}") 