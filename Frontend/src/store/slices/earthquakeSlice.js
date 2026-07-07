/**
 * @file earthquakeSlice.js
 * @description Redux slice for earthquake list state, filters, pagination, and selected earthquake.
 * @module store/slices/earthquake
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import earthquakeService from '../../services/earthquakeService';

// Thunks
export const fetchEarthquakes = createAsyncThunk(
  'earthquakes/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const data = await earthquakeService.getAll(params);
      // Backend returns structure: { success, data, meta: { total, page, limit, totalPages } }
      // Or in pagination response, we have different styles. Let's handle both.
      return {
        data: data.data || [],
        meta: data.meta || { total: 0, page: 1, limit: 10, totalPages: 0 }
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchEarthquakes = createAsyncThunk(
  'earthquakes/search',
  async ({ query, page, limit }, { rejectWithValue }) => {
    try {
      const data = await earthquakeService.search(query, page, limit);
      return {
        data: data.data || [],
        meta: data.meta || { total: 0, page: 1, limit: 10, totalPages: 0 },
        query
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchEarthquakeById = createAsyncThunk(
  'earthquakes/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await earthquakeService.getById(id);
      return data.data; // backend structure { success, data }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDashboardStats = createAsyncThunk(
  'earthquakes/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const [countRes, avgMagRes, highMagRes, deepRes] = await Promise.all([
        earthquakeService.getStatsCount(),
        earthquakeService.getStatsAvgMagnitude(),
        earthquakeService.getAll({ page: 1, limit: 1, magRange: 'high' }),
        earthquakeService.getAll({ page: 1, limit: 1, depthRange: 'deep' })
      ]);

      return {
        totalCount: countRes.data?.total ?? 0,
        avgMagnitude: parseFloat(avgMagRes.data?.averageMagnitude ?? 0).toFixed(2),
        highMagnitudeCount: highMagRes.meta?.total ?? 0,
        deepCount: deepRes.meta?.total ?? 0
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  earthquakes: [],
  meta: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  },
  selectedEarthquake: null,
  stats: {
    totalCount: 0,
    avgMagnitude: 0,
    highMagnitudeCount: 0,
    deepCount: 0,
  },
  filters: {
    country: '',
    place: '',
    magRange: '',
    depthRange: '',
  },
  searchQuery: '',
  sort: 'time-desc', // default sort
  loading: false,
  detailsLoading: false,
  statsLoading: false,
  error: null,
};

const earthquakeSlice = createSlice({
  name: 'earthquakes',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.meta.page = 1; // Reset page on filter change
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.searchQuery = '';
      state.meta.page = 1;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.meta.page = 1; // Reset page on search change
    },
    setSort: (state, action) => {
      state.sort = action.payload;
      state.meta.page = 1; // Reset page on sort change
    },
    setSelectedEarthquake: (state, action) => {
      state.selectedEarthquake = action.payload;
    },
    clearEarthquakeError: (state) => {
      state.error = null;
    },
    setPage: (state, action) => {
      state.meta.page = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Earthquakes
      .addCase(fetchEarthquakes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEarthquakes.fulfilled, (state, action) => {
        state.loading = false;
        state.earthquakes = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchEarthquakes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Search Earthquakes
      .addCase(searchEarthquakes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchEarthquakes.fulfilled, (state, action) => {
        state.loading = false;
        state.earthquakes = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(searchEarthquakes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch by ID
      .addCase(fetchEarthquakeById.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
        state.selectedEarthquake = null;
      })
      .addCase(fetchEarthquakeById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedEarthquake = action.payload;
      })
      .addCase(fetchEarthquakeById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload;
      })
      // Fetch Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.statsLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  resetFilters,
  setSearchQuery,
  setSort,
  setSelectedEarthquake,
  clearEarthquakeError,
  setPage
} = earthquakeSlice.actions;

export default earthquakeSlice.reducer;