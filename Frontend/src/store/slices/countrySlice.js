import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import analyticsService from '../../services/analyticsService';
import earthquakeService from '../../services/earthquakeService';

// ── Async Thunks ───────────────────────────────────────────────────────────
export const fetchCountryAnalysis = createAsyncThunk(
  'country/fetchCountryAnalysis',
  async (_, { rejectWithValue }) => {
    try {
      const res = await analyticsService.getCountryAnalysis();
      return res.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load country data');
    }
  }
);

export const fetchCountryDetail = createAsyncThunk(
  'country/fetchCountryDetail',
  async ({ country, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const res = await earthquakeService.getByCountry(country, page, limit);
      return { earthquakes: res.data || [], meta: res.meta || {}, country };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load country earthquakes');
    }
  }
);

// ── Slice ──────────────────────────────────────────────────────────────────
const countrySlice = createSlice({
  name: 'country',
  initialState: {
    // Country analysis list
    analysis:        [],
    analysisLoading: false,
    analysisError:   null,

    // Country detail earthquakes
    selectedCountry:  null,
    detail:           [],
    detailMeta:       {},
    detailLoading:    false,
    detailError:      null,
    detailPage:       1,

    // Search/filter
    searchQuery: '',
    sortBy:      'totalEarthquakes',
  },
  reducers: {
    setSearchQuery: (state, action) => { state.searchQuery = action.payload; },
    setSortBy:      (state, action) => { state.sortBy      = action.payload; },
    setDetailPage:  (state, action) => { state.detailPage  = action.payload; },
    clearDetail:    (state) => {
      state.selectedCountry = null;
      state.detail          = [];
      state.detailMeta      = {};
      state.detailPage      = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Country analysis
      .addCase(fetchCountryAnalysis.pending,  (s) => { s.analysisLoading = true;  s.analysisError = null; })
      .addCase(fetchCountryAnalysis.fulfilled,(s, a) => { s.analysisLoading = false; s.analysis = a.payload; })
      .addCase(fetchCountryAnalysis.rejected, (s, a) => { s.analysisLoading = false; s.analysisError = a.payload; })

      // Country detail
      .addCase(fetchCountryDetail.pending,  (s) => { s.detailLoading = true;  s.detailError = null; })
      .addCase(fetchCountryDetail.fulfilled,(s, a) => {
        s.detailLoading   = false;
        s.selectedCountry = a.payload.country;
        s.detail          = a.payload.earthquakes;
        s.detailMeta      = a.payload.meta;
      })
      .addCase(fetchCountryDetail.rejected, (s, a) => { s.detailLoading = false; s.detailError = a.payload; });
  },
});

export const { setSearchQuery, setSortBy, setDetailPage, clearDetail } = countrySlice.actions;
export default countrySlice.reducer;
