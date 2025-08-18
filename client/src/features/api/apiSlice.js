// src/features/api/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Use Vite's specific syntax to access the environment variable
const baseUrl = import.meta.env.VITE_API_URL;

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }), // Use the variable here
  endpoints: (builder) => ({}),
});