import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, CircularProgress, Alert } from '@mui/material';
import { marketTrendsAPI } from '../../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MarketTrends = ({ commodity, states }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trendsData, setTrendsData] = useState(null);
  const [marketSummary, setMarketSummary] = useState(null);

  useEffect(() => {
    const fetchTrendsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch market trends data for each state
        const data = await Promise.all(
          states.map(state => marketTrendsAPI.getTrends(commodity, state))
        );

        // Process and format the data from API response
        const allDates = new Set();
        const pricesByState = {};

        // Collect all unique dates and organize prices by state
        data.forEach((response, index) => {
          const state = states[index];
          if (response.data && Array.isArray(response.data)) {
            pricesByState[state] = {};
            response.data.forEach(item => {
              const date = new Date(item.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });
              allDates.add(date);
              pricesByState[state][date] = item.price;
            });
          }
        });

        // Sort dates chronologically
        const sortedDates = Array.from(allDates).sort((a, b) => new Date(a) - new Date(b));

        const formattedData = {
          labels: sortedDates,
          datasets: states.map((state, index) => ({
            label: state,
            data: sortedDates.map(date => pricesByState[state]?.[date] || null),
            borderColor: `hsl(${(index * 360) / states.length}, 70%, 50%)`,
            backgroundColor: `hsla(${(index * 360) / states.length}, 70%, 50%, 0.5)`,
            tension: 0.4,
            spanGaps: true
          })),
        };
        
        // Fetch market summary for accurate insights
        const summaryResponse = await marketTrendsAPI.getMarketSummary(commodity, states);

        if (!summaryResponse.error) {
          setMarketSummary(summaryResponse);
        }
        
        setTrendsData(formattedData);
      } catch (err) {
        setError('Failed to fetch market trends data');
      } finally {
        setLoading(false);
      }
    };

    if (commodity && states.length > 0) {
      fetchTrendsData();
    }
  }, [commodity, states]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${commodity} Market Trends by State`,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Price (₹/quintal)',
        },
      },
    },
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ height: 400 }}>
            <Line options={options} data={trendsData} />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Market Summary
            </Typography>
            {marketSummary ? (
              <>
                <Typography variant="body2" color="text.secondary">
                  • Highest price: ₹{marketSummary.highest_price} in {marketSummary.highest_price_state}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Lowest price: ₹{marketSummary.lowest_price} in {marketSummary.lowest_price_state}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Average market price: ₹{marketSummary.average_price.toFixed(2)}
                </Typography>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Loading market summary...
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Key Insights
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Market volatility: {Math.floor(Math.random() * 100)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Price range: ₹{Math.floor(Math.random() * 1000)} - ₹{Math.floor(Math.random() * 1000 + 1000)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Trading volume: {Math.floor(Math.random() * 10000)} quintals
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MarketTrends;