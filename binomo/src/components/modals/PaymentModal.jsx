// src/components/ui/PaymentModal.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CreditCard, X, Upload } from 'lucide-react';
import { useDepositMutation } from '../../features/payment/paymentApi';
import { setDeposit } from '../../features/payment/paymentSlice';
import "./PaymentModal.css";
import { CONFIG_API_BASE_URL } from '../../config/constants';

const API_BASE_URL = CONFIG_API_BASE_URL;

export default function PaymentModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  
  const { cardInfo } = useSelector((state) => state.payment);
  
  const [deposit, { isLoading }] = useDepositMutation();

  const [amount, setAmount] = useState('');
  const [file, setFile] = useState(null);
  const [provider, setProvider] = useState('Uzcard');
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (isOpen && !cardInfo.cardNumber) {
      // TODO: Dispatch fetchPaymentCard() если нужно
    }
  }, [isOpen, cardInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!file) {
      setLocalError("Kvitansiyani biriktiring");
      return;
    }

    const formData = new FormData();
    formData.append("Amount", Number(amount));
    formData.append("CardNumber", cardInfo.cardNumber || "8600123456789012"); // Fallback
    formData.append("Provider", provider);
    formData.append("receipt", file);

    console.log("📤 Sending deposit:");
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value instanceof File ? `File(${value.name})` : value);
    }

    try {
      const result = await deposit(formData).unwrap();

      console.log("✅ Deposit result:", result);

      dispatch(setDeposit(Number(amount)));

      alert('✅ Depozit muvaffaqiyatli yuborildi! Adminlar tekshiradi.');
      
      setAmount('');
      setFile(null);
      setProvider('Uzcard');
      
      onClose();
    } catch (error) {
      console.error("❌ Deposit error:", error);
      
      const errorMessage = 
        error.data?.error || 
        error.data?.title || 
        error.error || 
        "Noma'lum xatolik yuz berdi";
      
      setLocalError(errorMessage);
      alert(`❌ Xatolik: ${errorMessage}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className="payment-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="payment-modal-header">
          <h2 className="payment-modal-title">
            <CreditCard className="modal-icon" />
            Balansni to'ldirish
          </h2>
          <button onClick={onClose} className="close-button" disabled={isLoading}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="payment-form">
          {/* Реквизиты */}
          <div className="payment-details">
            <p className="details-label">O'tkazma rekvizitlari:</p>
            <div className="card-number">
              {cardInfo.cardNumber ? `💳 ${cardInfo.cardNumber}` : '💳 8600 1234 5678 9012'}
            </div>
            <div className="card-holder">
              👤 {cardInfo.cardHolderName || 'ADMIN CARD'}
            </div>
          </div>

          {/* Провайдер */}
          <div className="form-group">
            <label className="form-label">To'lov tizimi</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="form-select"
              disabled={isLoading}
            >
              <option value="Uzcard">Uzcard</option>
              <option value="Humo">Humo</option>
            </select>
          </div>

          {/* Сумма */}
          <div className="form-group">
            <label className="form-label">To'ldirish summasini kiriting</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="form-input"
              required
              disabled={isLoading}
            />
          </div>

          {/* Файл */}
          <div className="form-group">
            <p className="file-warning">
              ⚠️ Pul o'tkazilganidan so'ng kvitansiyani ALBATTA yuboring
            </p>
            <label className="file-upload">
              <Upload className="upload-icon" />
              <span>{file ? file.name : 'Kvitansiyani biriktiring'}</span>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                accept="image/*,.pdf"
                className="file-input"
                required
                disabled={isLoading}
              />
            </label>
          </div>

          {/* Ошибка */}
          {localError && (
            <div className="error-message">
              ❌ {localError}
            </div>
          )}

          {/* Кнопки */}
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isLoading || !file}
            >
              {isLoading ? (
                <span>
                  <span className="spinner"></span> Yuborilmoqda...
                </span>
              ) : (
                "Men to'ladim"
              )}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-secondary" 
              disabled={isLoading}
            >
              Bekor qilish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}