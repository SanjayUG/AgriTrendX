import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CropPricing = ({ commodity, states }) => {
  // Mock data - replace with actual API data
  const mockData = {
    labels: states,
    datasets: [
      {
        label: 'Current Price',
        data: states.map(() => Math.floor(Math.random() * 1000 + 1000)),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Average Price',
        data: states.map(() => Math.floor(Math.random() * 1000 + 1000)),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
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
        text: `${commodity} Price Comparison`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Price (₹/quintal)',
        },
      },
    },
  };

  const priceData = states.map(state => ({
    state,
    currentPrice: Math.floor(Math.random() * 1000 + 1000),
    averagePrice: Math.floor(Math.random() * 1000 + 1000),
    change: (Math.random() * 20 - 10).toFixed(2),
  }));

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ height: 300 }}>
            <Bar options={options} data={mockData} />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>State</TableCell>
                  <TableCell align="right">Current Price</TableCell>
                  <TableCell align="right">Average Price</TableCell>
                  <TableCell align="right">Change (%)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {priceData.map((row) => (
                  <TableRow key={row.state}>
                    <TableCell component="th" scope="row">
                      {row.state}
                    </TableCell>
                    <TableCell align="right">₹{row.currentPrice}</TableCell>
                    <TableCell align="right">₹{row.averagePrice}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`${row.change}%`}
                        color={parseFloat(row.change) >= 0 ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Price Insights
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Highest price: ₹{Math.max(...priceData.map(d => d.currentPrice))} in {priceData.find(d => d.currentPrice === Math.max(...priceData.map(d => d.currentPrice))).state}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Lowest price: ₹{Math.min(...priceData.map(d => d.currentPrice))} in {priceData.find(d => d.currentPrice === Math.min(...priceData.map(d => d.currentPrice))).state}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Average market price: ₹{Math.floor(priceData.reduce((acc, curr) => acc + curr.currentPrice, 0) / priceData.length)}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CropPricing; 