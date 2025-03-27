# AgriTrendX Backend

This is the backend service for AgriTrendX, an AI-driven market forecasting system for farmers. The service provides real-time insights on market trends, crop pricing, and demand forecasting to help farmers make informed decisions.

## Prerequisites

- Python 3.8 or higher
- MongoDB 4.4 or higher
- pip (Python package installer)

## Project Structure

```
backend/
├── app/
│   ├── __init__.py      # Flask application initialization
│   ├── config.py        # Configuration settings
│   ├── routes/          # API routes
│   │   ├── __init__.py
│   │   └── main.py
│   ├── models/          # Database models (to be added)
│   └── services/        # Business logic (to be added)
├── .env                 # Environment variables
├── requirements.txt     # Python dependencies
└── run.py              # Application entry point
```

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AgriTrendX/backend
   ```

2. **Create and activate virtual environment**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Linux/Mac
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   - Copy the `.env.example` file to `.env` (if available)
   - Or create a `.env` file with the following content:
     ```
     MONGO_URI=mongodb://localhost:27017/agriDB
     FLASK_DEBUG=True
     SECRET_KEY=your-secret-key-here
     ```

5. **Start MongoDB**
   - Make sure MongoDB is installed and running on your system
   - The default connection string assumes MongoDB is running locally on the default port (27017)

## Running the Application

1. **Start the Flask server**
   ```bash
   python run.py
   ```

2. **Access the API**
   - The server will start on http://localhost:5000
   - Available endpoints:
     - `GET /`: Welcome message and API information
     - `GET /health`: Health check endpoint

## API Endpoints

### Root Endpoint
- **URL**: `/`
- **Method**: `GET`
- **Description**: Returns welcome message and available endpoints
- **Response Example**:
  ```json
  {
    "message": "Welcome to AgriTrendX API",
    "version": "1.0",
    "endpoints": {
      "health": "/health",
      "docs": "/docs"
    }
  }
  ```

### Health Check
- **URL**: `/health`
- **Method**: `GET`
- **Description**: Checks the health status of the API and database connection
- **Response Example**:
  ```json
  {
    "status": "healthy",
    "database": "connected"
  }
  ```

## Development

- The application runs in debug mode by default
- Changes to the code will automatically reload the server
- The debugger PIN is displayed in the console when the server starts

## Troubleshooting

1. **MongoDB Connection Issues**
   - Ensure MongoDB is running on your system
   - Check if the MongoDB URI in `.env` is correct
   - Verify MongoDB is listening on the default port (27017)

2. **Port Already in Use**
   - If port 5000 is already in use, you can modify the port in `run.py`
   - Or kill the process using the port

3. **Module Not Found Errors**
   - Ensure you're in the virtual environment
   - Verify all dependencies are installed
   - Check if you're in the correct directory

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request
