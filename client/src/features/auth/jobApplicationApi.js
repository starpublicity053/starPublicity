import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const jobApplicationApi = createApi({
  reducerPath: "jobApplicationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api", // update if hosted elsewhere
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