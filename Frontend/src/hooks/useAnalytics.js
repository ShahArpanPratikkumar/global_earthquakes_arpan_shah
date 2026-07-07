/**
 * @file useAnalytics.js
 * @description Custom hook for accessing analytics data and actions.
 *              Wraps the Redux analytics slice for simplified component usage.
 *
 * @example
 *   const { trends, riskData, isLoading, loadTrends } = useAnalytics();
 */

import { useSelector, useDispatch } from 'react-redux';
import { fetchTrends, fetchRiskData } from '../store/slices/analyticsSlice';

function useAnalytics() {
  const dispatch = useDispatch();
  const { trends, riskData, heatmapData, isLoading, error } = useSelector(
    (state) => state.analytics
  );

  const loadTrends = (params) => dispatch(fetchTrends(params));
  const loadRiskData = (params) => dispatch(fetchRiskData(params));

  return {
    trends,
    riskData,
    heatmapData,
    isLoading,
    error,
    loadTrends,
    loadRiskData,
  };
}

export default useAnalytics;
