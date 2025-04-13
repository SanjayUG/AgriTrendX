import React, { useState, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Container,
  Paper,
  useScrollTrigger,
  Fab,
  Zoom,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as PriceIcon,
  Timeline as ForecastIcon,
  KeyboardArrowUp as UpIcon,
} from '@mui/icons-material';
import { Line, Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import CommoditySelector from '../selectors/CommoditySelector';
import StateSelector from '../selectors/StateSelector';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const sections = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { id: 'trends', label: 'Market Trends', icon: <TrendingUpIcon /> },
  { id: 'pricing', label: 'Crop Pricing', icon: <PriceIcon /> },
  { id: 'forecast', label: 'Demand Forecast', icon: <ForecastIcon /> },
];

// Sample data for charts
const priceHistoryData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Wheat Price ($/ton)',
      data: [210, 215, 225, 240, 230, 245],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.1
    }
  ]
};

const demandForecastData = {
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [
    {
      label: 'Projected Demand (tons)',
      data: [12000, 19000, 15000, 18000],
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
    }
  ]
};

const ScrollTop = ({ children, window }) => {
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      '#back-to-top-anchor',
    );

    if (anchor) {
      anchor.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Zoom>
  );
};

const MainLayout = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const theme = useTheme();
  const sectionRefs = {
    dashboard: useRef(null),
    trends: useRef(null),
    pricing: useRef(null),
    forecast: useRef(null),
  };

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    sectionRefs[sectionId].current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleScroll = () => {
    // Implement intersection observer logic here if needed
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <AppBar position="sticky" sx={{ backgroundColor: theme.palette.background.paper, width: '100%' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: theme.palette.text.primary }}>
            AgriTrendX
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {sections.map((section) => (
              <Button
                key={section.id}
                startIcon={section.icon}
                onClick={() => handleSectionChange(section.id)}
                sx={{
                  color: activeSection === section.id ? theme.palette.primary.main : theme.palette.text.secondary,
                }}
              >
                {section.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="main" onScroll={handleScroll} sx={{ overflowY: 'auto', height: 'calc(100vh - 64px)', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Dashboard Section */}
        <Box
          ref={sectionRefs.dashboard}
          id="dashboard"
          sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>
              Agricultural Market Dashboard
            </Typography>
            <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
              <CommoditySelector />
              <StateSelector />
            </Box>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 4 }}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Price History</Typography>
                <Line data={priceHistoryData} />
              </Paper>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Demand Forecast</Typography>
                <Bar data={demandForecastData} />
              </Paper>
            </Box>
          </Container>
        </Box>

        {/* Trends Section */}
        <Box
          ref={sectionRefs.trends}
          id="trends"
          sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>
              Market Trends Analysis
            </Typography>
            <Typography paragraph>
              Historical data and predictive analytics for agricultural commodities.
            </Typography>
            {/* Add trend charts here */}
          </Container>
        </Box>

        {/* Pricing Section */}
        <Box
          ref={sectionRefs.pricing}
          id="pricing"
          sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>
              Real-time Crop Pricing
            </Typography>
            <Typography paragraph>
              Current market prices across different regions.
            </Typography>
            {/* Add pricing tables/charts here */}
          </Container>
        </Box>

        {/* Forecast Section */}
        <Box
          ref={sectionRefs.forecast}
          id="forecast"
          sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>
              AI-Powered Demand Forecast
            </Typography>
            <Typography paragraph>
              Predictive models for future market demand.
            </Typography>
            {/* Add forecast visualizations here */}
          </Container>
        </Box>
      </Box>

      <ScrollTop>
        <Fab color="primary" size="small" aria-label="scroll back to top">
          <UpIcon />
        </Fab>
      </ScrollTop>
    </Box>
  );
};

export default MainLayout;