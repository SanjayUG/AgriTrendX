import React from 'react';
import {
  Box,
  Grid,
  Typography,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DemandForecast = ({ commodity, states }) => {
  // Mock data - replace with actual API data
  const mockData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    datasets: [
      {
        label: 'Demand Forecast',
        data: Array.from({ length: 9 }, () => Math.random() * 100),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        fill: true,
      },
      {
        label: 'Supply Forecast',
        data: Array.from({ length: 9 }, () => Math.random() * 100),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${commodity} Demand & Supply Forecast`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Quantity (quintals)',
        },
      },
    },
  };

  const forecastData = states.map(state => ({
    state,
    demand: Math.floor(Math.random() * 1000 + 1000),
    supply: Math.floor(Math.random() * 1000 + 1000),
    trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable',
  }));

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon color="success" />;
      case 'down':
        return <TrendingDownIcon color="error" />;
      default:
        return <TrendingFlatIcon color="warning" />;
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ height: 300 }}>
            <Line options={options} data={mockData} />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Demand-Supply Analysis
            </Typography>
            <List dense>
              {forecastData.map((data) => (
                <ListItem key={data.state}>
                  <ListItemIcon>
                    {getTrendIcon(data.trend)}
                  </ListItemIcon>
                  <ListItemText
                    primary={data.state}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          Demand: {data.demand} quintals | Supply: {data.supply} quintals
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={(data.demand / data.supply) * 100}
                          sx={{ mt: 1 }}
                        />
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              AI Insights
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Expected demand growth: {Math.floor(Math.random() * 20)}% in next quarter
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Supply-demand gap: {Math.floor(Math.random() * 1000)} quintals
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Market sentiment: {Math.random() > 0.5 ? 'Positive' : 'Negative'}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DemandForecast; 