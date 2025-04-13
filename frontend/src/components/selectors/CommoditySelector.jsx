import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { useCommodity } from '../../context/CommodityContext';

const commodityCategories = {
  grains: ['Rice', 'Wheat', 'Maize', 'Barley', 'Oats'],
  pulses: ['Lentils', 'Chickpeas', 'Black Gram', 'Green Gram', 'Pigeon Pea'],
  oilseeds: ['Soybean', 'Sunflower', 'Groundnut', 'Mustard', 'Sesame'],
  vegetables: ['Tomatoes', 'Onions', 'Potatoes', 'Carrots', 'Cabbage'],
  fruits: ['Mangoes', 'Apples', 'Bananas', 'Oranges', 'Grapes'],
};

const CommoditySelector = () => {
  const { selectedCommodity, setSelectedCommodity } = useCommodity();

  const handleChange = (event) => {
    setSelectedCommodity(event.target.value);
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Select Commodity
      </Typography>
      <FormControl fullWidth size="small">
        <InputLabel id="commodity-select-label">Commodity</InputLabel>
        <Select
          labelId="commodity-select-label"
          id="commodity-select"
          value={selectedCommodity || ''}
          label="Commodity"
          onChange={handleChange}
        >
          {Object.entries(commodityCategories).map(([category, items]) => [
            <MenuItem key={category} disabled>
              <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                {category}
              </Typography>
            </MenuItem>,
            ...items.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            )),
          ])}
        </Select>
      </FormControl>
      {selectedCommodity && (
        <Box sx={{ mt: 1 }}>
          <Chip
            label={selectedCommodity}
            onDelete={() => setSelectedCommodity(null)}
            color="primary"
            size="small"
          />
        </Box>
      )}
    </Box>
  );
};

export default CommoditySelector; 