import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const marketTrendsAPI = {
    getTrends: async (commodity, state) => {
        try {
            const response = await api.get(`/api/market-trends/${commodity}/${state}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching market trends:', error);
            throw error;
        }
    },
    getMarketSummary: async (commodity, states) => {
        try {
            const queryParams = states.map(s => `states[]=${s}`).join('&');
            const response = await api.get(`/api/market-summary/${commodity}?${queryParams}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching market summary:', error);
            throw error;
        }
    }
};

export default api;