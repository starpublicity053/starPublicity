import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const contactApi = createApi({
  reducerPath: "contactApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/", // Base URL for your API server
  }),
  endpoints: (builder) => ({
    // This mutation is used by your ATL marketing page popup
    sendATLInquiry: builder.mutation({
      query: (formData) => ({
        url: "atl/ATL-inquiry", // Endpoint for ATL inquiries
        method: "POST",
        body: formData,
      }),
    }),
    
    // This mutation is ready for your BTL page
    sendBTLInquiry: builder.mutation({
      query: (formData) => ({
        url: "btl/BTL-inquiry", // Endpoint for BTL inquiries
        method: "POST",
        body: formData,
      }),
    }),

    // This mutation is ready for your TTL page
    sendTTLInquiry: builder.mutation({
      query: (formData) => ({
        url: "ttl/TTL-inquiry", // Endpoint for TTL inquiries
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

// Export the hooks for use in your components
export const {
  useSendATLInquiryMutation,
  useSendBTLInquiryMutation,
  useSendTTLInquiryMutation,
} = contactApi;