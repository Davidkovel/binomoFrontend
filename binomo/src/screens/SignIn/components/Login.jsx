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
  
  // Получаем состояние из Redux - isLoading теперь из auth slice
  const { error, isLoading } = useSelector((state) => state.auth);
  
  // useLoginMutation - хук для выполнения login запроса
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
    dispatch(clearError()); // Очищаем ошибку через dispatch
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    try {
      // Вызов API - login mutation
      const result = await login(formData).unwrap();
      
      // Если успешно
      localStorage.setItem('access_token', result.accessToken);
      if (result.refreshToken) {
        localStorage.setItem('refresh_token', result.refreshToken);
      }
      // Для login у нас нет имени в форме, можно получить из ответа или оставить пустым
      dispatch(setUser({ 
        name: result.name || 'User', // если бэкенд возвращает имя
        email: formData.email 
      }));
      
      navigate('/trading');
      
    } catch (error) {
      console.log('Full error object:', error);
      
      if (error.data) {
        const data = error.data;
        
        if (Array.isArray(data) && data.length > 0) {
          if (data[0].loc && data[0].loc.includes('password')) {
            dispatch(setError('Noto‘g‘ri email yoki parol'));
          } else {
            dispatch(setError(data[0].msg || 'Maʼlumotlarni tekshirishda xatolik'));
          }
        } else if (data.detail) {
          dispatch(setError(data.detail));
        } else if (data.message) {
          dispatch(setError(data.message));
        } else {
          dispatch(setError('Noto‘g‘ri email yoki parol'));
        }
      } else {
        dispatch(setError('Serverga ulanish muvaffaqiyatsiz. Backend 8080-portda ishlayotganiga ishonch hosil qiling.'));
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
            <TrendingUp size={40} className="logo-icon" />
          </div>
          <h1 className="auth-title">Qaytganingiz bilan tabriklaymiz</h1>
          <p className="auth-subtitle">
            Savdo hisobingizga kirish uchun tizimga kiring
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
              Email manzil
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Email manzilingizni kiriting"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock size={18} />
              Parol
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Parolingizni kiriting"
              required
            />
          </div>

          <button 
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner">Kirilmoqda...</span>
            ) : (
              'Kirish'
            )}
          </button>
        </form>

        <div className="auth-toggle">
          <p>
            Hisobingiz yo'qmi?
            <a href="/register" className="toggle-link">
              Ro'yxatdan o'tish
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}