import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AlertCircle, User, Mail, Lock, TrendingUp } from 'lucide-react';

import { useSignUpMutation } from '../../../features/auth/authApi'
import { setError, clearError, setUser } from '../../../features/auth/authSlice'
import { CONFIG_API_BASE_URL } from '../../../config/constants';

import './Register.css';

// test@gmail.com
// stringString123%%%

const API_BASE_URL = CONFIG_API_BASE_URL;

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, isLoading } = useSelector((state) => state.auth);
  const [signUp] = useSignUpMutation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    dispatch(clearError()); // Очищаем ошибку
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы
    dispatch(clearError());

    if (formData.password.length < 6) {
      dispatch(setError('The password must be at least 6 characters long.'));
      return;
    }

    try {
      // Вызов API - как await _authService.SignUpAsync(request)
      const result = await signUp(formData).unwrap();
      
      // Если успешно (как response.IsSuccessStatusCode)
      localStorage.setItem('access_token', result.accessToken);
      if (result.refreshToken) {
        localStorage.setItem('refresh_token', result.refreshToken);
      }
      dispatch(setUser({ 
        name: formData.name, 
        email: formData.email 
      }));
      
      // Редирект - как NavigationManager.NavigateTo("/trading")
      navigate('/trading');
      
    } catch (error) {
      if (error.data) {
        const data = error.data;
        
        // Проверяем формат ошибки (аналог ProblemDetails в C#)
        if (Array.isArray(data) && data.length > 0) {
          // Ошибка валидации - как ModelState.AddError()
          if (data[0].loc && data[0].loc.includes('password')) {
            dispatch(setError('Weak password. Example of a strong password: qwertyQwerty12??'));
          } else {
            dispatch(setError(data[0].msg || 'Error in data verification'));
          }
        } else if (data.detail) {
          // Кастомная ошибка - как ProblemDetails.Detail
          dispatch(setError(data.detail));
        } else if (data.message) {
          dispatch(setError(data.message));
        } else {
          dispatch(setError('Weak password. Example of a strong password: qwertyQwerty12??'));
        }
      } else {
        // Сетевая ошибка
        dispatch(setError('500 Internal Server Error'));
      }
    }
  };

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
          <h1 className="auth-title">Create an account</h1>
          <p className="auth-subtitle">
            Sign up to start crypto trading
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <div className="auth-form">
          <div className="form-group">
            <label className="form-label">
              <User size={18} />
              Full name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="form-input-auth"
              placeholder="Enter your full name"
              required
            />
          </div>

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
              placeholder="Create a password (at least 6 characters)"
              required
              minLength={6}
            />
          </div>

          <button 
            onClick={handleSubmit}
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              'Create an account'
            )}
          </button>
        </div>

        <div className="auth-toggle">
          <p>
            Do you already have an account?
            <a href="/login" className="toggle-link">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}