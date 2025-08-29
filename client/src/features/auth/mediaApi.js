import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const mediaApi = createApi({
  reducerPath: "mediaApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  endpoints: (builder) => ({
    requestCallback: builder.mutation({
      query: (formData) => ({
        // ✅ CHANGE IS HERE: Added '/api' to match the backend route
        url: "/media/request-callback",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useRequestCallbackMutation } = mediaApi;