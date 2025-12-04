import { configureStore } from '@reduxjs/toolkit';

import authReducer from './features/auth/authSlice';
import tradingReducer from './features/trading/tradingSlice'
import tradingUIReducer from './features/trading/tradingUISlice'
import paymentReducer from './features/payment/paymentSlice';
import { authApi } from './features/auth/authApi';
import { tradingApi } from './features/trading/tradingApi';
import { paymentApi} from './features/payment/paymentApi';

// как AddServices в ASP.NET
export const store = configureStore({
  reducer: {
    auth: authReducer,       // Di container
    trading: tradingReducer,
    tradingUI: tradingUIReducer,
    payment: paymentReducer,
    [authApi.reducerPath]: authApi.reducer,
    [tradingApi.reducerPath]: tradingApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(tradingApi.middleware)
      .concat(paymentApi.middleware)
});

// services.AddSingleton<IAuthService, AuthService>();