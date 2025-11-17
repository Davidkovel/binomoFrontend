import { jwtDecode } from 'jwt-decode';

export const tokenUtils = {
  checkAuthStatus() {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!accessToken) {
      return { isAuthenticated: false, hasRefreshToken: false };
    }

    try {
      const decoded = jwtDecode(accessToken);
      const currentTime = Date.now() / 1000;
      const isValid = decoded.exp > currentTime;
      
      return {
        isAuthenticated: isValid,
        hasRefreshToken: !!refreshToken,
        tokenExpiry: decoded.exp,
        timeUntilExpiry: decoded.exp - currentTime
      };
    } catch (error) {
      return { isAuthenticated: false, hasRefreshToken: !!refreshToken };
    }
  },
  
  // Очищаем все токены
  clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};