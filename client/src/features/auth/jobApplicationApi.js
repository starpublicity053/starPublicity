import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const jobApplicationApi = createApi({
  reducerPath: "jobApplicationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL, // CORRECTED: Use the environment variable
  }),
  endpoints: (builder) => ({
    submitApplication: builder.mutation({
      query: (formData) => ({
        url: "/apply",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useSubmitApplicationMutation } = jobApplicationApi;