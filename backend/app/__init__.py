from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
from .config import Config

mongo = PyMongo()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    mongo.init_app(app)
    CORS(app)
    
    # Register blueprints
    from .routes import main
    from .routes import kaggle
    from .routes import forecasting
    
    app.register_blueprint(main.bp)
    app.register_blueprint(kaggle.bp, url_prefix='/api/kaggle')
    app.register_blueprint(forecasting.bp, url_prefix='/api/forecasting')
    
    return app 