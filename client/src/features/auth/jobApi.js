// features/auth/jobApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const jobApi = createApi({
  reducerPath: 'jobApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.VITE_API_URL // CORRECTED: Use the environment variable
  }), 
  tagTypes: ['Job'],
  endpoints: (builder) => ({
    getJobs: builder.query({
      query: () => '/jobs',
      providesTags: ['Job'],
    }),
    addJob: builder.mutation({
      query: (job) => ({
        url: '/jobs',
        method: 'POST',
        body: job,
      }),
      invalidatesTags: ['Job'],
    }),
    deleteJob: builder.mutation({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Job'],
    }),
  }),
});

export const { useGetJobsQuery, useAddJobMutation, useDeleteJobMutation } = jobApi;