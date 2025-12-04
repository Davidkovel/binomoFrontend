import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


// Slice
const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    balance: 0,
    cardInfo: {
      cardNumber: '',
      cardHolderName: '',
    },
    pendingWithdrawal: null, // { withdrawalId, amount, commission }
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    setDeposit: (state, action) => {
      state.balance += action.payload;
    },

    setPendingWithdrawal: (state, action) => {
      state.pendingWithdrawal = action.payload;
    },
    clearPendingWithdrawal: (state) => {
      state.pendingWithdrawal = null;
    },
  },
});

export const { clearError, setDeposit,setPendingWithdrawal, clearPendingWithdrawal } = paymentSlice.actions;
export default paymentSlice.reducer;