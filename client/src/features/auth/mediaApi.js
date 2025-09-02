import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const mediaApi = createApi({
  reducerPath: "mediaApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  tagTypes: ["Media"],
  endpoints: (builder) => ({
    requestCallback: builder.mutation({
      query: (formData) => ({
        url: "/media/request-callback",
        method: "POST",
        body: formData,
      }),
    }),
    getMediaInquiries: builder.query({
      query: () => "/media",
      providesTags: (result = []) => [
        "Media",
        ...result.map(({ _id }) => ({ type: "Media", id: _id })),
      ],
    }),
  }),
});

export const { useRequestCallbackMutation, useGetMediaInquiriesQuery } =
  mediaApi;