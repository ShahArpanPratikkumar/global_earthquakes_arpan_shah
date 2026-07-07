/**
 * @file useEarthquakes.js
 * @description Custom hook to access and manage earthquake data state.
 *              Wraps the Redux earthquake slice with convenient derived values.
 *
 * @example
 *   const { earthquakes, isLoading, filters, setFilter } = useEarthquakes();
 */

import { useSelector, useDispatch } from 'react-redux';
import {
  fetchEarthquakes,
  setFilter,
  clearFilters,
  setSelectedEarthquake,
} from '../store/slices/earthquakeSlice';

function useEarthquakes() {
  const dispatch = useDispatch();
  const { items, selected, filters, pagination, isLoading, error } = useSelector(
    (state) => state.earthquake
  );

  const loadEarthquakes = (params) => dispatch(fetchEarthquakes(params));
  const updateFilter = (key, value) => dispatch(setFilter({ key, value }));
  const resetFilters = () => dispatch(clearFilters());
  const selectEarthquake = (id) => dispatch(setSelectedEarthquake(id));

  return {
    earthquakes: items,
    selectedEarthquake: selected,
    filters,
    pagination,
    isLoading,
    error,
    loadEarthquakes,
    updateFilter,
    resetFilters,
    selectEarthquake,
  };
}

export default useEarthquakes;
