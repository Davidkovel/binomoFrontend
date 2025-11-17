import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import {CONFIG_API_BASE_URL} from '../../config/constants';

const baseQueryWithLogging = async (args, api, extraOptions) => {
  console.group('🔍 RTK Query Request');
  console.log('URL:', args.url);
  console.log('Method:', args.method || 'GET');
  console.log('Body:', args.body);
  console.log('Headers:', args.headers);
  console.groupEnd();

  const result = await fetchBaseQuery({
    baseUrl: `${CONFIG_API_BASE_URL}/api/Trading`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  })(args, api, extraOptions);

  console.group('📨 RTK Query Response');
  console.log('Response status:', result.meta?.response?.status);
  console.log('Response data:', result.data);
  console.log('Error:', result.error);
  console.groupEnd();

  return result;
};

export const tradingApi = createApi({
  reducerPath: 'tradingApi',
  baseQuery: baseQueryWithLogging,
  tagTypes: ['Position', 'ActivePositions'],
  endpoints: (builder) => ({
    // Open Position
    openPosition: builder.mutation({
        query: (positionData) => {
        const url = '/positions/open';
        console.log('🚀 Opening position - URL:', url);
        console.log('📤 Position data:', positionData);
        
        return {
            url: url,
            method: 'POST',
            body: positionData,
        };
        },
        invalidatesTags: ['ActivePositions'],
    }),
        
    // Close Position
    closePosition: builder.mutation({
      query: (closeData) => ({
        url: '/positions/close',
        method: 'POST',
        body: closeData,
      }),
      invalidatesTags: ['ActivePositions', 'Position'],
    }),
    
    // Get Active Positions
    getActivePositions: builder.query({
      query: () => '/positions/active',
      providesTags: ['ActivePositions'],
      // Кэшируем на 10 секунд
      keepUnusedDataFor: 10,
    }),
    
    // Get Position by ID
    getPosition: builder.query({
      query: (positionId) => `/positions/${positionId}`,
      providesTags: (result, error, id) => [{ type: 'Position', id }],
    }),

    getHistoryPositions: builder.query({
      query: ({ page = 1, pageSize = 20 }) => 
        `/positions/history?page=${page}&pageSize=${pageSize}`,
      providesTags: ['HistoryPositions'],
      keepUnusedDataFor: 30, // Кэш на 30 секунд
    })
  }),
});

export const {
  useOpenPositionMutation,
  useClosePositionMutation,
  useGetActivePositionsQuery,
  useGetPositionQuery,
  useGetHistoryPositionsQuery,
} = tradingApi;