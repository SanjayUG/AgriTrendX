import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
import os
from typing import List, Dict, Any

class ModelTrainer:
    def __init__(self):
        self.model_path = os.path.join('models', 'pretrained')
        os.makedirs(self.model_path, exist_ok=True)
        
    def prepare_data(self, data: List[float], sequence_length: int = 30) -> tuple:
        """
        Prepare data for training
        """
        scaler = MinMaxScaler()
        scaled_data = scaler.fit_transform(np.array(data).reshape(-1, 1))
        
        X, y = [], []
        for i in range(len(scaled_data) - sequence_length):
            X.append(scaled_data[i:(i + sequence_length)])
            y.append(scaled_data[i + sequence_length])
            
        return np.array(X), np.array(y), scaler
    
    def build_model(self, sequence_length: int, n_features: int = 1):
        """
        Build LSTM model
        """
        model = Sequential([
            LSTM(50, return_sequences=True, input_shape=(sequence_length, n_features)),
            Dropout(0.2),
            LSTM(50, return_sequences=False),
            Dropout(0.2),
            Dense(1)
        ])
        
        model.compile(optimizer='adam', loss='mse')
        return model
    
    def train_model(self, commodity: str, data: List[float], epochs: int = 50, batch_size: int = 32):
        """
        Train and save model for a specific commodity
        """
        try:
            # Prepare data
            X, y, scaler = self.prepare_data(data)
            
            # Build and train model
            model = self.build_model(X.shape[1], X.shape[2])
            model.fit(X, y, epochs=epochs, batch_size=batch_size, validation_split=0.1)
            
            # Save model and scaler
            model_file = os.path.join(self.model_path, f"{commodity.lower()}_model.h5")
            scaler_file = os.path.join(self.model_path, f"{commodity.lower()}_scaler.npy")
            
            model.save(model_file)
            np.save(scaler_file, scaler)
            
            return True
        except Exception as e:
            print(f"Error training model for {commodity}: {str(e)}")
            return False

def train_commodity_models():
    """
    Train models for different commodities
    """
    trainer = ModelTrainer()
    
    # Sample data for different commodities
    # In a real application, this would be historical data from your database
    commodities_data = {
        'rice': np.random.normal(100, 10, 1000).tolist(),
        'wheat': np.random.normal(80, 8, 1000).tolist(),
        'corn': np.random.normal(60, 6, 1000).tolist(),
        'soybeans': np.random.normal(120, 12, 1000).tolist(),
        'cotton': np.random.normal(150, 15, 1000).tolist()
    }
    
    for commodity, data in commodities_data.items():
        print(f"Training model for {commodity}...")
        success = trainer.train_model(commodity, data)
        if success:
            print(f"Successfully trained and saved model for {commodity}")
        else:
            print(f"Failed to train model for {commodity}")

if __name__ == "__main__":
    train_commodity_models() 