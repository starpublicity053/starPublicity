// src/features/api/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Use the environment variable for the base URL
const baseUrl = process.env.VITE_API_URL;

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }), // Use the variable here
  endpoints: (builder) => ({}),
});