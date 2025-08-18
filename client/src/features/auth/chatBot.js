import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// ✅ Define and export your backend URL in this one location.
export const BACKEND_URL = 'http://localhost:5000';

export const chatbotApi = createApi({
    reducerPath: 'chatbotApi',
    // Use the constant to construct the base URL for API requests
    baseQuery: fetchBaseQuery({ baseUrl: `${BACKEND_URL}/api/` }),
    endpoints: (builder) => ({
        // This endpoint is for your original AI chatbot
        postQuery: builder.mutation({
            query: (body) => ({
                url: 'query',
                method: 'POST',
                body: body,
            }),
        }),

        // ✅ This endpoint is for initiating the WhatsApp Live Chat
        initiateLiveChat: builder.mutation({
            query: (body) => ({
                url: 'live-chat/initiate',
                method: 'POST',
                body: body,
            }),
        }),
    }),
});

// Export the auto-generated hooks
export const { 
    usePostQueryMutation, 
    useInitiateLiveChatMutation 
} = chatbotApi;