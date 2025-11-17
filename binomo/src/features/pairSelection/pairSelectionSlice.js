import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

  },
});

export const { setLoading, setError, clearError, setUser, logout } = authSlice.actions;

export default authSlice.reducer;