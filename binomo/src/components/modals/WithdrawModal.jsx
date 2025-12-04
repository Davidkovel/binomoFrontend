import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { CreditCard, X, Upload, AlertCircle, ChevronRight } from 'lucide-react';
import { useWithdrawMutation, usePayCommissionMutation } from '../../features/payment/paymentApi';
import { UserContext } from "../../features/context/UserContext"

import './WithdrawModal.css';

import { CONFIG_API_BASE_URL } from '../../config/constants';

const API_BASE_URL = CONFIG_API_BASE_URL;


function WithdrawModal({ isOpen, onClose }) {
  const [withdraw, { isLoading: isWithdrawing }] = useWithdrawMutation();
  const [payCommission, { isLoading: isPayingCommission }] = usePayCommissionMutation();

  const { cardInfo } = useSelector((state) => state.payment);

  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [file, setFile] = useState(null);
  const { userBalance, setUserBalance } = useContext(UserContext);
  const [localError, setLocalError] = useState(null);
  
  const [pendingWithdrawal, setPendingWithdrawal] = useState(null);

  const safeAmount = Number(amount) || 0;
  const commission = safeAmount * 0.15;
  const totalRequired = safeAmount + commission;

  useEffect(() => {
    if (isOpen) {
      fetchUserBalance();
      
      // Check for pending withdrawal
      const pending = localStorage.getItem('pendingWithdraw');
      if (pending) {
        try {
          const data = JSON.parse(pending);
          setPendingWithdrawal(data);
          setAmount(data.amount);
          setCardNumber(data.cardNumber);
          setFullName(data.fullName);
          setStep(2);
        } catch (err) {
          console.error('Failed to parse pending withdrawal:', err);
        }
      }
    }
  }, [isOpen]);

  const fetchUserBalance = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/api/user/get_balance`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUserBalance(data.balance);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (totalRequired > userBalance) {
      setLocalError(
        `Balansda yetarli mablag' yo'q!\n` +
        `Kerakli: ${totalRequired.toLocaleString()} USD (${safeAmount.toLocaleString()} + ${commission.toLocaleString()} komissiya)\n` +
        `Sizning balansingiz: ${userBalance.toLocaleString()} USD`
      );
      return;
    }

    try {
      const result = await withdraw({
        amount: safeAmount,
        cardNumber: cardNumber.trim(),
        fullName: fullName.trim(),
      }).unwrap();

      console.log('✅ Withdrawal initiated:', result);

      // Save pending withdrawal data
      const pendingData = {
        withdrawalId: result.withdrawalId,
        amount: safeAmount,
        commission: result.commission,
        cardNumber: cardNumber,
        fullName: fullName,
      };
      
      localStorage.setItem('pendingWithdraw', JSON.stringify(pendingData));
      setPendingWithdrawal(pendingData);

      // Move to step 2
      setStep(2);
      
      alert("✅ Yechish so'rovi yaratildi! Endi komissiyani to'lang.");
    } catch (error) {
      console.error('❌ Withdrawal error:', error);
      
      const errorMessage = 
        error.data?.error || 
        error.data?.title || 
        error.error || 
        "Noma'lum xatolik yuz berdi";
      
      setLocalError(errorMessage);
      alert(`❌ Xatolik: ${errorMessage}`);
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!file) {
      setLocalError("Komissiya to'lovi kvitansiyasini biriktiring");
      return;
    }

    if (!pendingWithdrawal) {
      setLocalError("Pending withdrawal data not found");
      return;
    }

    /*const formData = new FormData();
    formData.append("WithdrawalId", pendingWithdrawal.withdrawalId);
    formData.append("CommissionAmount", commission);
    formData.append("receipt", file);*/
    try {
      //const result = await payCommission(formData).unwrap();

      //console.log('✅ Commission paid:', result);

      // Clear pending data
      localStorage.removeItem('pendingWithdraw');
      setPendingWithdrawal(null);

      // Success
      alert("✅ Komissiya to'landi! So'rovingiz ko'rib chiqilmoqda.");
      
      // Reset form
      setStep(1);
      setAmount('');
      setCardNumber('');
      setFullName('');
      setFile(null);
      
      // Refresh balance
      await fetchUserBalance();
      
      onClose();
    } catch (error) {
      console.error('❌ Commission payment error:', error);
      
      const errorMessage = 
        error.data?.error || 
        error.data?.title || 
        error.error || 
        "Noma'lum xatolik yuz berdi";
      
      setLocalError(errorMessage);
      alert(`❌ Xatolik: ${errorMessage}`);
    }
  };

  const handleBack = () => {
    setStep(1);
    setFile(null);
    setLocalError(null);
  };

  if (!isOpen) return null;

  const isLoading = isWithdrawing || isPayingCommission;

  return (
    <div className="withdraw-modal-overlay" onClick={onClose}>
      <div className="withdraw-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="withdraw-modal-header">
          {step === 2 && (
            <button className="back-button" onClick={handleBack} disabled={isLoading}>
              <ChevronRight size={20} className="rotate-180" />
            </button>
          )}
          <h2 className="withdraw-modal-title">
            <CreditCard className="withdraw-modal-icon" />
            {step === 1 ? 'Pul yechish' : "Komissiyani to'lash"}
          </h2>
          <button onClick={onClose} className="close-button" disabled={isLoading}>
            <X size={20} />
          </button>
        </div>

        {/* Step 1: Withdrawal Request */}
        {step === 1 ? (
          <form onSubmit={handleStep1Submit} className="withdraw-form">

            {/* Amount Input */}
            <div className="form-group">
              <label className="form-label">Yechib olinadigan summa (USD)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-input"
                required
                disabled={isLoading}
              />
            </div>

            {/* Calculation Preview */}
            {amount && (
              <div className="calculation-preview">
                <div className="calculation-row">
                  <span>Yechib olinadigan summa:</span>
                  <span>{safeAmount.toLocaleString()} USD</span>
                </div>
                <div className="calculation-row">
                  <span>Komissiya (15%):</span>
                  <span>{commission.toLocaleString()} USD</span>
                </div>
                <div className="calculation-row total">
                  <span>Jami to'lov:</span>
                  <span>{totalRequired.toLocaleString()} USD</span>
                </div>
                <div className={`balance-check ${totalRequired <= userBalance ? 'sufficient' : 'insufficient'}`}>
                  {totalRequired <= userBalance ? (
                    <span>✅ Mablag' yetarli</span>
                  ) : (
                    <span>❌ Mablag' yetarli emas</span>
                  )}
                </div>
              </div>
            )}

            {/* Card Number */}
            <div className="form-group">
              <label className="form-label">Karta raqami</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="8600 0000 0000 0000"
                className="form-input"
                maxLength="19"
                required
                disabled={isLoading}
              />
            </div>

            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">Ism va familiya</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Kartadagi ism va familiyani kiriting"
                className="form-input"
                required
                disabled={isLoading}
              />
            </div>

            {/* Error Message */}
            {localError && (
              <div className="error-message">
                <AlertCircle size={16} />
                <span>{localError}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading || !amount || totalRequired > userBalance}
            >
              {isLoading ? (
                <span>
                  <span className="spinner"></span> Yuborilmoqda...
                </span>
              ) : (
                'Davom etish'
              )}
            </button>
          </form>
        ) : (
          /* Step 2: Pay Commission */
          <form onSubmit={handleStep2Submit} className="commission-form">
            {/* Commission Info */}
            <div className="commission-info-card">
              <div className="commission-info-text">
                <AlertCircle size={20} className="info-icon" />
                <p>
                  Komissiyani to'lash uchun quyidagi rekvizitlarga{' '}
                  <strong>{commission.toLocaleString()} USD</strong> o'tkazing
                </p>
              </div>
            </div>

            {/* Calculation Summary */}
            <div className="calculation-section">
              <div className="calculation-row">
                <span>Yechib olinadigan summa:</span>
                <span>{safeAmount.toLocaleString()} USD</span>
              </div>
              <div className="calculation-row">
                <span>Komissiya (15%):</span>
                <span>{commission.toLocaleString()} USD</span>
              </div>
              <div className="calculation-row total">
                <span>To'lash kerak:</span>
                <span>{commission.toLocaleString()} USD</span>
              </div>
            </div>

            {/* Payment Details */}
            <div className="payment-details">
              <p className="details-label">Komissiyani to'lash uchun rekvizitlar:</p>
              <div className="card-number">
                💳 Karta: {cardInfo.cardNumber || '8600 1234 5678 9012'}
              </div>
              <div className="card-holder">
                👤 Ega: {cardInfo.cardHolderName || 'ADMIN CARD'}
              </div>
            </div>

            {/* File Upload */}
            <div className="form-group">
              <p className="file-warning">
                ⚠️ Komissiyani to'laganingizdan so'ng kvitansiyani (chekni) ALBATTA yuboring
              </p>
              <label className="file-upload">
                <Upload className="upload-icon" />
                <span>{file ? file.name : "Komissiya to'lovi kvitansiyasini biriktiring"}</span>
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

            {/* Error Message */}
            {localError && (
              <div className="error-message">
                <AlertCircle size={16} />
                <span>{localError}</span>
              </div>
            )}

            {/* Submit Button */}
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
                "Komissiyani to'lash"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default WithdrawModal;