import api from './api';

const analyticsService = {
  getCountryAnalysis: async () => {
    const response = await api.get('/analytics/earthquakes/country-analysis');
    return response.data;
  },

  getNetworkAnalysis: async () => {
    const response = await api.get('/analytics/earthquakes/network-analysis');
    return response.data;
  },

  getMagnitudeAnalysis: async () => {
    const response = await api.get('/analytics/earthquakes/magnitude-analysis');
    return response.data;
  },

  getDepthAnalysis: async () => {
    const response = await api.get('/analytics/earthquakes/depth-analysis');
    return response.data;
  },

  getMonthlyAnalysis: async () => {
    const response = await api.get('/analytics/earthquakes/monthly-analysis');
    return response.data;
  },

  getRecentActivity: async (country = null) => {
    const params = country ? { country } : {};
    const response = await api.get('/analytics/earthquakes/recent-activity', { params });
    return response.data;
  },

  getHighestMagnitude: async () => {
    const response = await api.get('/analytics/earthquakes/highest-magnitude');
    return response.data;
  },

  getLocationAnalysis: async () => {
    const response = await api.get('/analytics/earthquakes/location-analysis');
    return response.data;
  },

  getErrorAnalysis: async () => {
    const response = await api.get('/analytics/earthquakes/error-analysis');
    return response.data;
  },
};

export default analyticsService;
