import { configureStore } from '@reduxjs/toolkit';

import authReducer from './features/auth/authSlice';
import tradingReducer from './features/trading/tradingSlice'
import tradingUIReducer from './features/trading/tradingUISlice'
import { authApi } from './features/auth/authApi';
import { tradingApi } from './features/trading/tradingApi';

// как AddServices в ASP.NET
export const store = configureStore({
  reducer: {
    auth: authReducer,       // Di container
    trading: tradingReducer,
    tradingUI: tradingUIReducer,
    [authApi.reducerPath]: authApi.reducer,
    [tradingApi.reducerPath]: tradingApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(tradingApi.middleware),
});

// services.AddSingleton<IAuthService, AuthService>();