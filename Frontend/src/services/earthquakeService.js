/**
 * @file earthquakeService.js
 * @description Earthquake API service wrapping CRUD and search REST endpoints.
 * @module services/earthquake
 */

import api from './api';

const earthquakeService = {
  // Main list fetching with dynamic endpoint routing
  getAll: async (params = {}) => {
    const { page = 1, limit = 10, sort, country, place, magRange, depthRange, minMagnitude, minDepth } = params;
    const queryParams = { page, limit };

    if (sort === 'magnitude-desc') {
      const response = await api.get('/earthquakes/sort/magnitude-desc', { params: queryParams });
      return response.data;
    }
    if (sort === 'time-desc') {
      const response = await api.get('/earthquakes/sort/time-desc', { params: queryParams });
      return response.data;
    }
    if (country) {
      const response = await api.get(`/earthquakes/country/${encodeURIComponent(country)}`, { params: queryParams });
      return response.data;
    }
    if (place) {
      const response = await api.get(`/earthquakes/place/${encodeURIComponent(place)}`, { params: queryParams });
      return response.data;
    }
    if (magRange === 'high' || minMagnitude >= 6.0) {
      const response = await api.get('/earthquakes/high-magnitude', { params: queryParams });
      return response.data;
    }
    if (depthRange === 'deep' || minDepth >= 300) {
      const response = await api.get('/earthquakes/deep', { params: queryParams });
      return response.data;
    }
    if (magRange === 'critical') {
      const response = await api.get('/earthquakes/critical', { params: queryParams });
      return response.data;
    }

    const generalParams = { page, limit, ...params };
    const response = await api.get('/earthquakes', { params: generalParams });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/earthquakes/${id}`);
    return response.data;
  },

  // Search
  search: async (query, page = 1, limit = 10) => {
    const response = await api.get('/search/earthquakes', { params: { q: query, page, limit } });
    return response.data;
  },

  // Specialised routes
  getRecent: async (limit = 10) => {
    const response = await api.get('/earthquakes/recent', { params: { limit } });
    return response.data;
  },

  getCritical: async (page = 1, limit = 10) => {
    const response = await api.get('/earthquakes/critical', { params: { page, limit } });
    return response.data;
  },

  getTopByMagnitude: async (page = 1, limit = 50) => {
    const response = await api.get('/earthquakes/sort/magnitude-desc', { params: { page, limit } });
    return response.data;
  },

  getHighMagnitude: async (page = 1, limit = 10) => {
    const response = await api.get('/earthquakes/high-magnitude', { params: { page, limit } });
    return response.data;
  },

  getDeep: async (page = 1, limit = 10) => {
    const response = await api.get('/earthquakes/deep', { params: { page, limit } });
    return response.data;
  },

  getByCountry: async (country, page = 1, limit = 10) => {
    const response = await api.get(`/earthquakes/country/${encodeURIComponent(country)}`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Stats for Dashboard
  getStatsCount: async () => {
    const response = await api.get('/stats/earthquakes/count');
    return response.data;
  },

  getStatsAvgMagnitude: async () => {
    const response = await api.get('/stats/earthquakes/average-magnitude');
    return response.data;
  },

  getStatsAvgDepth: async () => {
    const response = await api.get('/stats/earthquakes/average-depth');
    return response.data;
  },

  getStatsHighestMagnitude: async () => {
    const response = await api.get('/stats/earthquakes/highest-magnitude');
    return response.data;
  },

  getStatsDeepest: async () => {
    const response = await api.get('/stats/earthquakes/deepest');
    return response.data;
  },
};

export default earthquakeService;