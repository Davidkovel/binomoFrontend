// src/features/auth/AuthApi.js
import { fetchJSON } from '@/api/api';

export class AuthApi {
  constructor() {
    this.accessToken = localStorage.getItem('access_token') || null;
    this.refreshToken = localStorage.getItem('refresh_token') || null;
  }

  async register({ name, email, password }) {
    const data = await fetchJSON('/api/Auth/sign-up', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    this._saveTokens(data);
    return data;
  }

  async login({ email, password }) {
    const data = await fetchJSON('/api/Auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this._saveTokens(data);
    return data;
  }

  async refreshTokenIfNeeded() {
    if (!this.refreshToken) return;

    try {
      const data = await fetchJSON('/api/Auth/refresh-token', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });
      this._saveTokens(data);
      return data;
    } catch (err) {
      console.warn('Token refresh failed', err);
      this.clearTokens();
      return null;
    }
  }

  getAccessToken() {
    return this.accessToken;
  }

  _saveTokens(data) {
    this.accessToken = data.accessToken;
    this.refreshToken = data.refreshToken;
    localStorage.setItem('access_token', data.accessToken);
    localStorage.setItem('refresh_token', data.refreshToken);
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}

export const authApi = new AuthApi();
