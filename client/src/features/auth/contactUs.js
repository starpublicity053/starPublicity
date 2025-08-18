// src/features/auth/contactUs.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const contactUsApi = createApi({
  reducerPath: 'contactUsApi',
  baseQuery: fetchBaseQuery({ 
    // Use Vite's correct syntax for environment variables
    baseUrl: import.meta.env.VITE_API_URL 
  }),

  tagTypes: ['Inquiry'],

  endpoints: (builder) => ({
    sendContactInquiry: builder.mutation({
      query: (formData) => ({
        url: 'contact/inquiry',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Inquiry'],
    }),

    getContactInquiries: builder.query({
      query: () => 'contact/inquiries',
      providesTags: ['Inquiry'],
    }),

    forwardContactInquiry: builder.mutation({
      query: ({ id, forwardingEmail }) => ({
        url: `contact/inquiries/${id}/forward`,
        method: 'POST',
        body: { forwardingEmail },
      }),
      invalidatesTags: ['Inquiry'],
    }),

    // NEW MUTATIONS ADDED BELOW:
    updateContactInquiryStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `contact/inquiries/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Inquiry'],
    }),
    addContactInquiryNote: builder.mutation({
      query: ({ id, content }) => ({
        url: `contact/inquiries/${id}/notes`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: ['Inquiry'],
    }),
  }),
});

// IMPORTANT: Ensure these new hooks are exported here
export const {
  useSendContactInquiryMutation,
  useGetContactInquiriesQuery,
  useForwardContactInquiryMutation,
  useUpdateContactInquiryStatusMutation,
  useAddContactInquiryNoteMutation,
} = contactUsApi;