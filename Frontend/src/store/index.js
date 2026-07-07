/**
 * @file index.js
 * @description Redux Toolkit store combining all feature slices: auth, earthquake, analytics, country, ui.
 * @module store
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer       from './slices/authSlice';
import earthquakeReducer from './slices/earthquakeSlice';
import analyticsReducer  from './slices/analyticsSlice';
import uiReducer         from './slices/uiSlice';
import countryReducer    from './slices/countrySlice';

export const store = configureStore({
  reducer: {
    auth:        authReducer,
    earthquakes: earthquakeReducer,
    analytics:   analyticsReducer,
    ui:          uiReducer,
    country:     countryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;