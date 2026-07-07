/**
 * @file useAuth.js
 * @description Custom hook to access authentication state and actions.
 *              Wraps the Redux auth slice for easier component consumption.
 *
 * @example
 *   const { user, isAuthenticated, login, logout } = useAuth();
 */

import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logoutUser, registerUser } from '../store/slices/authSlice';

/**
 * @returns {{ user, isAuthenticated, isLoading, error, login, register, logout }}
 */
function useAuth() {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

  const login = (credentials) => dispatch(loginUser(credentials));
  const register = (userData) => dispatch(registerUser(userData));
  const logout = () => dispatch(logoutUser());

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
  };
}

export default useAuth;
