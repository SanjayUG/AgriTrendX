import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from typing import Dict, Any, List, Tuple
import os
from datetime import datetime, timedelta

class MarketForecastingService:
    def __init__(self):
        self.scaler = MinMaxScaler()
        self.model = None
        self.data_path = os.path.join('outputs', 'datasets')
        
    def prepare_data(self, df: pd.DataFrame, target_column: str, sequence_length: int = 30) -> Tuple[np.ndarray, np.ndarray]:
        """
        Prepare data for LSTM model
        """
        # Scale the data
        scaled_data = self.scaler.fit_transform(df[[target_column]])
        
        # Create sequences
        X, y = [], []
        for i in range(len(scaled_data) - sequence_length):
            X.append(scaled_data[i:(i + sequence_length)])
            y.append(scaled_data[i + sequence_length])
            
        return np.array(X), np.array(y)
    
    def build_model(self, sequence_length: int, n_features: int = 1):
        """
        Build LSTM model for time series forecasting
        """
        self.model = Sequential([
            LSTM(50, return_sequences=True, input_shape=(sequence_length, n_features)),
            Dropout(0.2),
            LSTM(50, return_sequences=False),
            Dropout(0.2),
            Dense(1)
        ])
        
        self.model.compile(optimizer='adam', loss='mse')
    
    def train_model(self, X: np.ndarray, y: np.ndarray, epochs: int = 50, batch_size: int = 32):
        """
        Train the LSTM model
        """
        if self.model is None:
            self.build_model(X.shape[1], X.shape[2])
            
        self.model.fit(X, y, epochs=epochs, batch_size=batch_size, validation_split=0.1)
    
    def predict(self, X: np.ndarray) -> np.ndarray:
        """
        Make predictions using the trained model
        """
        if self.model is None:
            raise Exception("Model not trained yet")
            
        predictions = self.model.predict(X)
        return self.scaler.inverse_transform(predictions)
    
    def analyze_market_trends(self, df: pd.DataFrame, target_column: str) -> Dict[str, Any]:
        """
        Analyze market trends and generate insights
        """
        try:
            # Calculate basic statistics
            stats = {
                'mean': df[target_column].mean(),
                'std': df[target_column].std(),
                'min': df[target_column].min(),
                'max': df[target_column].max(),
                'trend': 'increasing' if df[target_column].iloc[-1] > df[target_column].iloc[0] else 'decreasing'
            }
            
            # Calculate price volatility
            volatility = df[target_column].pct_change().std() * 100
            
            # Calculate moving averages
            ma7 = df[target_column].rolling(window=7).mean()
            ma30 = df[target_column].rolling(window=30).mean()
            
            # Generate insights
            insights = {
                'current_price': df[target_column].iloc[-1],
                'price_change_7d': ((df[target_column].iloc[-1] - df[target_column].iloc[-7]) / df[target_column].iloc[-7]) * 100,
                'price_change_30d': ((df[target_column].iloc[-1] - df[target_column].iloc[-30]) / df[target_column].iloc[-30]) * 100,
                'volatility': volatility,
                'trend_strength': 'strong' if abs(ma7.iloc[-1] - ma30.iloc[-1]) > volatility else 'weak'
            }
            
            return {
                'statistics': stats,
                'insights': insights,
                'recommendations': self._generate_recommendations(insights)
            }
        except Exception as e:
            raise Exception(f"Error analyzing market trends: {str(e)}")
    
    def _generate_recommendations(self, insights: Dict[str, Any]) -> List[str]:
        """
        Generate recommendations based on market insights
        """
        recommendations = []
        
        # Price trend recommendations
        if insights['price_change_7d'] > 5:
            recommendations.append("Consider selling soon as prices are showing strong upward trend")
        elif insights['price_change_7d'] < -5:
            recommendations.append("Consider holding as prices are showing strong downward trend")
            
        # Volatility recommendations
        if insights['volatility'] > 10:
            recommendations.append("High market volatility detected. Consider diversifying your portfolio")
            
        # Trend strength recommendations
        if insights['trend_strength'] == 'strong':
            recommendations.append("Strong trend detected. Consider following the trend direction")
            
        return recommendations
    
    def generate_graph_data(self, df: pd.DataFrame, target_column: str, date_column: str = None) -> Dict[str, Any]:
        """
        Generate data for frontend graphs
        """
        try:
            # If no date column specified, try to find one
            if not date_column:
                date_columns = ['date', 'timestamp', 'year', 'month', 'day']
                date_column = next((col for col in date_columns if col in df.columns), None)
            
            # Sort by date if available
            if date_column:
                df = df.sort_values(date_column)
            
            # Calculate moving averages
            ma7 = df[target_column].rolling(window=7).mean()
            ma30 = df[target_column].rolling(window=30).mean()
            
            # Prepare data for the graph
            graph_data = {
                'labels': df[date_column].tolist() if date_column else list(range(len(df))),
                'datasets': [
                    {
                        'label': 'Actual Price',
                        'data': df[target_column].tolist(),
                        'borderColor': 'rgb(75, 192, 192)',
                        'tension': 0.1
                    },
                    {
                        'label': '7-day Moving Average',
                        'data': ma7.tolist(),
                        'borderColor': 'rgb(255, 99, 132)',
                        'tension': 0.1
                    },
                    {
                        'label': '30-day Moving Average',
                        'data': ma30.tolist(),
                        'borderColor': 'rgb(54, 162, 235)',
                        'tension': 0.1
                    }
                ]
            }
            
            return graph_data
        except Exception as e:
            raise Exception(f"Error generating graph data: {str(e)}")
    
    def generate_forecast_graph(self, df: pd.DataFrame, target_column: str, date_column: str = None, days: int = 30) -> Dict[str, Any]:
        """
        Generate forecast data for the graph
        """
        try:
            # Prepare data and train model
            X, y = self.prepare_data(df, target_column)
            self.train_model(X, y)
            
            # Generate forecast
            last_sequence = X[-1:]
            forecast = self.predict(last_sequence)
            
            # Generate future dates
            if date_column:
                last_date = pd.to_datetime(df[date_column].iloc[-1])
                future_dates = [last_date + timedelta(days=i) for i in range(1, days + 1)]
            else:
                future_dates = list(range(len(df), len(df) + days))
            
            # Prepare forecast data
            forecast_data = {
                'labels': future_dates,
                'datasets': [
                    {
                        'label': 'Forecast',
                        'data': [float(forecast[0][0])] * days,
                        'borderColor': 'rgb(153, 102, 255)',
                        'borderDash': [5, 5],
                        'tension': 0.1
                    }
                ]
            }
            
            return forecast_data
        except Exception as e:
            raise Exception(f"Error generating forecast graph: {str(e)}") 