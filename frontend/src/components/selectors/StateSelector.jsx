import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  Stack,
} from '@mui/material';
import { useState } from '../../context/StateContext';

const statesByRegion = {
  'North India': ['Punjab', 'Haryana', 'Uttar Pradesh', 'Delhi', 'Himachal Pradesh'],
  'South India': ['Karnataka', 'Tamil Nadu', 'Kerala', 'Andhra Pradesh', 'Telangana'],
  'East India': ['West Bengal', 'Bihar', 'Odisha', 'Jharkhand', 'Assam'],
  'West India': ['Maharashtra', 'Gujarat', 'Goa', 'Rajasthan', 'Madhya Pradesh'],
  'Central India': ['Chhattisgarh', 'Uttarakhand', 'Jammu and Kashmir', 'Ladakh'],
};

const StateSelector = () => {
  const { selectedStates, setSelectedStates } = useState();

  const handleChange = (event) => {
    setSelectedStates(event.target.value);
  };

  const handleDelete = (stateToDelete) => {
    setSelectedStates(selectedStates.filter((state) => state !== stateToDelete));
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Select States
      </Typography>
      <FormControl fullWidth size="small">
        <InputLabel id="state-select-label">States</InputLabel>
        <Select
          labelId="state-select-label"
          id="state-select"
          multiple
          value={selectedStates || []}
          label="States"
          onChange={handleChange}
          renderValue={(selected) => (
            <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
              {selected.map((value) => (
                <Chip key={value} label={value} size="small" />
              ))}
            </Stack>
          )}
        >
          {Object.entries(statesByRegion).map(([region, states]) => [
            <MenuItem key={region} disabled>
              <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                {region}
              </Typography>
            </MenuItem>,
            ...states.map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            )),
          ])}
        </Select>
      </FormControl>
      {selectedStates && selectedStates.length > 0 && (
        <Box sx={{ mt: 1 }}>
          <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
            {selectedStates.map((state) => (
              <Chip
                key={state}
                label={state}
                onDelete={() => handleDelete(state)}
                color="secondary"
                size="small"
              />
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default StateSelector; 