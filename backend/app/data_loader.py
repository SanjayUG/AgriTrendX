import os
import json
import pandas as pd
import numpy as np
from kaggle.api.kaggle_api_extended import KaggleApi
from datetime import datetime, timedelta

class DataLoader:
    def __init__(self):
        self.api = KaggleApi()
        self.api.authenticate()
        self.dataset_path = os.path.join(os.path.dirname(__file__), 'data')
        self.csv_path = os.path.join(self.dataset_path, 'agricultural_prices.csv')
        os.makedirs(self.dataset_path, exist_ok=True)
        self.df = None
        
    def download_dataset(self, dataset_name='akshatgupta07/agricultural-commodity-prices-in-india'):
        """Download dataset from Kaggle and create mock data if download fails"""
        try:
            if not os.path.exists(self.csv_path):
                print(f'Downloading dataset from Kaggle...')
                self.api.dataset_download_files(dataset_name, path=self.dataset_path, unzip=True)
            
            # Load the dataset
            self.df = pd.read_csv(self.csv_path)
            self._process_data()
            return True
        except Exception as e:
            print(f'Error downloading dataset: {str(e)}')
            self._create_mock_data()
            return True

    def _process_data(self):
        """Process the downloaded data"""
        if self.df is not None:
            # Convert date column to datetime
            self.df['date'] = pd.to_datetime(self.df['date'])
            # Sort by date
            self.df.sort_values('date', inplace=True)
            # Clean commodity names and states
            self.df['commodity'] = self.df['commodity'].str.lower()
            self.df['state'] = self.df['state'].str.lower()

    def _create_mock_data(self):
        """Create mock data if Kaggle dataset is unavailable"""
        print('Creating mock data...')
        dates = pd.date_range(start='2023-01-01', end='2024-02-29', freq='D')
        commodities = ['rice', 'wheat', 'maize', 'potato', 'onion']
        states = ['maharashtra', 'punjab', 'karnataka', 'uttar pradesh', 'gujarat']
        
        data = []
        for date in dates:
            for commodity in commodities:
                for state in states:
                    base_price = 2000 + (commodity == 'rice') * 500 + (state == 'punjab') * 300
                    seasonal_factor = 1 + 0.2 * np.sin(2 * np.pi * date.dayofyear / 365)
                    trend_factor = 1 + 0.1 * (date - dates[0]).days / len(dates)
                    noise = np.random.normal(0, 0.05)
                    price = base_price * seasonal_factor * trend_factor * (1 + noise)
                    
                    data.append({
                        'date': date,
                        'commodity': commodity,
                        'state': state,
                        'price': round(price, 2)
                    })
        
        self.df = pd.DataFrame(data)

    def load_market_trends(self, commodity, state):
        """Load market trends data for a specific commodity and state"""
        try:
            if self.df is None:
                self.download_dataset()

            filtered_df = self.df[
                (self.df['commodity'] == commodity.lower()) &
                (self.df['state'] == state.lower())
            ].copy()

            if filtered_df.empty:
                return {'error': f'No data found for {commodity} in {state}'}

            # Get last 30 days of data
            filtered_df = filtered_df.sort_values('date').tail(30)
            
            result = [{
                'date': row['date'].strftime('%Y-%m-%d'),
                'price': float(row['price'])
            } for _, row in filtered_df.iterrows()]
            
            return {'data': result}
            
        except Exception as e:
            print(f'Error processing data: {str(e)}')
            return {'error': 'Failed to process market trends data'}

    def get_market_summary(self, commodity, states):
        """Get market summary for a commodity across multiple states"""
        try:
            if self.df is None:
                self.download_dataset()

            # Get latest date's data for the commodity across specified states
            filtered_df = self.df[
                (self.df['commodity'] == commodity.lower()) &
                (self.df['state'].isin([s.lower() for s in states]))
            ].copy()

            if filtered_df.empty:
                return {'error': f'No data found for {commodity}'}

            latest_date = filtered_df['date'].max()
            latest_data = filtered_df[filtered_df['date'] == latest_date]

            if latest_data.empty:
                return {'error': 'No recent data available'}

            # Calculate summary statistics
            highest_price_row = latest_data.loc[latest_data['price'].idxmax()]
            lowest_price_row = latest_data.loc[latest_data['price'].idxmin()]

            return {
                'highest_price': float(highest_price_row['price']),
                'highest_price_state': highest_price_row['state'].title(),
                'lowest_price': float(lowest_price_row['price']),
                'lowest_price_state': lowest_price_row['state'].title(),
                'average_price': float(latest_data['price'].mean())
            }
            
        except Exception as e:
            print(f'Error getting market summary: {str(e)}')
            return {'error': 'Failed to get market summary'}