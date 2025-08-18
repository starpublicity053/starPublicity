// reelApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reelApi = createApi({
  reducerPath: "reelApi",
  baseQuery: fetchBaseQuery({
    // CORRECTED: Use the environment variable for the base URL
    baseUrl: import.meta.env.VITE_API_URL, 
  }),
  tagTypes: ["Reel"], // Defines the tag for caching purposes
  endpoints: (builder) => ({
    getReels: builder.query({
      query: () => "reels", // Endpoint is relative to the base URL
      providesTags: ["Reel"],
    }),
    addReel: builder.mutation({
      query: (newReelData) => ({
        url: "reels", 
        method: "POST",
        body: newReelData,
      }),
      invalidatesTags: ["Reel"],
    }),
    updateReel: builder.mutation({
      query: ({ id, patchData }) => ({
        url: `reels/${id}`, 
        method: "PUT",
        body: patchData,
      }),
      invalidatesTags: ["Reel"],
    }),
    deleteReel: builder.mutation({
      query: (id) => ({
        url: `reels/${id}`,
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