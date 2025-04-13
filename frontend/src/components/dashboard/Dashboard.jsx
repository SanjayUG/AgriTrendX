import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useCommodity } from '../../context/CommodityContext';
import { useState } from '../../context/StateContext';
import MarketTrends from './MarketTrends';
import CropPricing from './CropPricing';
import DemandForecast from './DemandForecast';

const Dashboard = () => {
  const { selectedCommodity } = useCommodity();
  const { selectedStates } = useState();

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: '1200px', width: '100%' }}>
        <Typography variant="h4" gutterBottom>
          Market Insights for {selectedCommodity}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Selected States: {selectedStates.join(', ')}
        </Typography>
        
        <Grid container spacing={3}>
          {/* Market Trends Section */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Market Trends
              </Typography>
              <MarketTrends commodity={selectedCommodity} states={selectedStates} />
            </Paper>
          </Grid>

          {/* Crop Pricing Section */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Crop Pricing
              </Typography>
              <CropPricing commodity={selectedCommodity} states={selectedStates} />
            </Paper>
          </Grid>

          {/* Demand Forecasting Section */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Demand Forecasting
              </Typography>
              <DemandForecast commodity={selectedCommodity} states={selectedStates} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;