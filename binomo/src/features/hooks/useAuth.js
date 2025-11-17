// src/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { logout } from '../auth/authSlice'

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const isTokenValid = useCallback((token) => {
    if (!token) return false;
    
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      return decoded.exp > currentTime;
    } catch (error) {
      console.error('Invalid token:', error);
      return false;
    }
  }, []);

  const refreshToken = useCallback(async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch('/api/user/auth/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      
      localStorage.setItem('access_token', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refresh_token', data.refreshToken);
      }
      
      return data.accessToken;
    } catch (error) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      dispatch(logout());
      throw error;
    }
  }, [dispatch]);

  // Функция для проверки и обновления токена при необходимости
  const checkAndRefreshToken = useCallback(async () => {
    const accessToken = localStorage.getItem('access_token');
    
    // Если нет access token, пользователь не авторизован
    if (!accessToken) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    }

    // Проверяем валидность access token
    if (isTokenValid(accessToken)) {
      setIsAuthenticated(true);
      setIsLoading(false);
      return true;
    }

    // Если access token истек, проверяем есть ли refresh token
    const refreshToken = localStorage.getItem('refresh_token');
    
    // Если нет refresh token, просто разлогиниваем
    if (!refreshToken) {
      console.log('Access token expired and no refresh token available');
      localStorage.removeItem('access_token');
      setIsAuthenticated(false);
      setIsLoading(false);
      dispatch(logout());
      return false;
    }

    // Если есть refresh token, пытаемся обновить
    try {
      console.log('Attempting to refresh token...');
      const newToken = await refreshToken();
      setIsAuthenticated(true);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      setIsAuthenticated(false);
      setIsLoading(false);
      dispatch(logout());
      return false;
    }
  }, [isTokenValid, refreshToken, dispatch]);

  // Проверяем аутентификацию при загрузке
  useEffect(() => {
    checkAndRefreshToken();
  }, [checkAndRefreshToken]);

  // Функция для входа (сохраняем оба токена)
  const login = useCallback((tokens) => {
    localStorage.setItem('access_token', tokens.accessToken);
    if (tokens.refreshToken) {
      localStorage.setItem('refresh_token', tokens.refreshToken);
    }
    setIsAuthenticated(true);
  }, []);

  // Функция для выхода
  const handleLogout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    dispatch(logout());
  }, [dispatch]);

  return {
    isAuthenticated,
    setIsAuthenticated,
    isLoading,
    checkAndRefreshToken,
    login,
    logout: handleLogout
  };
};