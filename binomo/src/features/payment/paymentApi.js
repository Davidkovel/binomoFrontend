import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG_API_BASE_URL } from '../../config/constants';

const API_BASE_URL = CONFIG_API_BASE_URL;

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${CONFIG_API_BASE_URL}/api/Payments`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Balance'], // For auto-refetch
  endpoints: (builder) => ({
    // Deposit
    deposit: builder.mutation({
      query: (formData) => ({
        url: '/deposit',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Balance'],
    }),

    withdraw: builder.mutation({
      query: (data) => ({
        url: '/withdraw',
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Balance'],
    }),

    // Withdrawal Step 2 (Commission)
    payCommission: builder.mutation({
      query: (formData) => ({
        url: '/withdraw/pay-commission',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Balance'],
    }),

    // Get Balance
    getBalance: builder.query({
      query: () => '/balance',
      providesTags: ['Balance'],
    }),

    // Get Card Info
    getCardInfo: builder.query({
      query: () => '/card-info', // Нужно добавить endpoint на бэкенде
    }),
  }),
});

export const {
  useDepositMutation,
  useWithdrawMutation,
  usePayCommissionMutation,
  useGetBalanceQuery,
  useGetCardInfoQuery,
} = paymentApi;