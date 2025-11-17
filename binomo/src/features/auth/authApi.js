import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CONFIG_API_BASE_URL } from '../../config/constants';

const API_BASE_URL = CONFIG_API_BASE_URL;

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api/Auth`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (credentials) => ({
        url: 'sign-up',
        method: 'POST',
        body: credentials,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST', 
        body: credentials,
      }),
    }),
    me: builder.query({
      query: () => ({
        url: '/me',
        method: 'GET',
      }),
    }),
  }),
});

export const { useSignUpMutation, useLoginMutation, useMeQuery} = authApi;