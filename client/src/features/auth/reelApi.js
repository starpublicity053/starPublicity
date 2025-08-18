// reelApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reelApi = createApi({
  reducerPath: "reelApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/", // Base URL for all requests
  }),
  tagTypes: ["Reel"], // Defines the tag for caching purposes
  endpoints: (builder) => ({
    getReels: builder.query({
      query: () => "api/reels", // URL is now relative to the baseUrl
      providesTags: ["Reel"],
    }),
    addReel: builder.mutation({
      query: (newReelData) => ({
        url: "api/reels", // URL is now relative to the baseUrl
        method: "POST",
        body: newReelData,
      }),
      invalidatesTags: ["Reel"],
    }),
    updateReel: builder.mutation({
      query: ({ id, patchData }) => ({
        url: `api/reels/${id}`, // URL is now relative to the baseUrl
        method: "PUT",
        body: patchData,
      }),
      invalidatesTags: ["Reel"],
    }),
    deleteReel: builder.mutation({
      query: (id) => ({
        url: `api/reels/${id}`, // URL is now relative to the baseUrl
        method: "DELETE",
      }),
      invalidatesTags: ["Reel"],
    }),
  }),
});

// Export the auto-generated hooks
export const {
  useGetReelsQuery,
  useAddReelMutation,
  useUpdateReelMutation,
  useDeleteReelMutation,
} = reelApi;