import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Lock, Mail, TrendingUp, AlertCircle } from 'lucide-react';

import { useLoginMutation } from '../../../features/auth/authApi';
import { setError, clearError, setUser } from '../../../features/auth/authSlice';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { error, isLoading } = useSelector((state) => state.auth);
  
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    try {
      const result = await login(formData).unwrap();
      
      localStorage.setItem('access_token', result.accessToken);
      if (result.refreshToken) {
        localStorage.setItem('refresh_token', result.refreshToken);
      }
      dispatch(setUser({ 
        name: result.name || 'User',
        email: formData.email 
      }));
      
      navigate('/trading');
      
    } catch (error) {
      if (error.data) {
        const data = error.data;
        
        if (Array.isArray(data) && data.length > 0) {
          if (data[0].loc && data[0].loc.includes('password')) {
            dispatch(setError('Incorrect email or password'));
          } else {
            dispatch(setError(data[0].msg || 'Error in data verification'));
          }
        } else if (data.detail) {
          dispatch(setError(data.detail));
        } else if (data.message) {
          dispatch(setError(data.message));
        } else {
          dispatch(setError('Incorrect email or password'));
        }
      } else {
        dispatch(setError('500 Internal Server Error'));
      }
    }
  };

  // Объединяем загрузки из slice и mutation
  const loading = isLoading || isLoginLoading;

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-container">
            <TrendingUp size={40} className="logo-icon-auth" />
          </div>
          <h1 className="auth-title">Congratulations on your return.</h1>
          <p className="auth-subtitle">
            Log in to access your trading account.
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">
              <Mail size={18} />
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input-auth"
              placeholder="Enter your email address"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock size={18} />
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="form-input-auth"
              placeholder="Enter your password"
              required
            />
          </div>

          <button 
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner">Being entered...</span>
            ) : (
              'Introduction'
            )}
          </button>
        </form>

        <div className="auth-toggle">
          <p>
            Don't have an account?
            <a href="/register" className="toggle-link">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}