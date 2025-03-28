# AgriTrendX Frontend

This is the frontend for AgriTrendX, an AI-driven market forecasting system for farmers. The frontend is built using React and Vite, providing a fast and modern development experience.

## Features

- **Real-time Supply Insights**: View crop supply data from various regions.
- **Demand Forecasting**: AI-powered predictions for future crop demands.
- **Price Trends**: Monitor price trends and get recommendations for selling opportunities.
- **Interactive UI**: Smooth animations and responsive design for a seamless user experience.

## Prerequisites

- Node.js 16 or higher
- npm or yarn package manager

## Project Structure

frontend/ ├── public/ # Static assets │ └── images/ # Images used in the app ├── src/ # Source code │ ├── App.jsx # Main application component │ ├── main.jsx # Entry point for React │ ├── App.css # Application styles │ └── index.css # Global styles ├── .gitignore # Git ignore rules ├── eslint.config.js # ESLint configuration ├── index.html # HTML template ├── package.json # Project metadata and dependencies ├── README.md # Project documentation └── vite.config.js # Vite configuration


## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AgriTrendX/frontend

2. **Install dependencies**
    ```bash
    npm install

3. **Start the development server**
    ```bash
    npm run dev

4. **Access the application**
Open your browser and navigate to http://localhost:5173.

## Scripts

npm run dev: Start the development server.
npm run build: Build the application for production.
npm run preview: Preview the production build.
npm run lint: Run ESLint to check for code quality issues.

## Development

The application uses Vite for fast builds and hot module replacement (HMR).
ESLint is configured to enforce coding standards and best practices.

## Deployment

1. **Build the application**
    ``bash
    npm run build

2. **Deploy the contents of the dist folder to your preferred hosting service**

## License

This Project structure is licensed under the MIT License 
