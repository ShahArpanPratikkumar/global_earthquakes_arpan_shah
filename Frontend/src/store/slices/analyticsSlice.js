/**
 * @file analyticsSlice.js
 * @description Redux slice for analytics trends, risk data, and heatmap coordinates.
 * @module store/slices/analytics
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import analyticsService from '../../services/analyticsService';

// Thunks
export const fetchAnalyticsData = createAsyncThunk(
  'analytics/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const [countryRes, networkRes, magnitudeRes, monthlyRes, recentRes] = await Promise.all([
        analyticsService.getCountryAnalysis(),
        analyticsService.getNetworkAnalysis(),
        analyticsService.getMagnitudeAnalysis(),
        analyticsService.getMonthlyAnalysis(),
        analyticsService.getRecentActivity()
      ]);

      return {
        countryData: countryRes.data || [],
        networkData: networkRes.data || [],
        magnitudeData: magnitudeRes.data || [],
        monthlyData: monthlyRes.data || [],
        recentActivity: recentRes.data || []
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  countryData: [],
  networkData: [],
  magnitudeData: [],
  monthlyData: [],
  recentActivity: [],
  loading: false,
  error: null
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearAnalyticsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalyticsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalyticsData.fulfilled, (state, action) => {
        state.loading = false;
        state.countryData = action.payload.countryData;
        state.networkData = action.payload.networkData;
        state.magnitudeData = action.payload.magnitudeData;
        state.monthlyData = action.payload.monthlyData;
        state.recentActivity = action.payload.recentActivity;
      })
      .addCase(fetchAnalyticsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearAnalyticsError } = analyticsSlice.actions;
export default analyticsSlice.reducer;