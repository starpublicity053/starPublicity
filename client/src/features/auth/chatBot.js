import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const chatbotApi = createApi({
    reducerPath: 'chatbotApi',
    // Use the environment variable directly for the base URL
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
    endpoints: (builder) => ({
        // This endpoint is for your original AI chatbot
        // It will make a request to: [your_backend_url]/api/query
        postQuery: builder.mutation({
            query: (body) => ({
                url: 'query',
                method: 'POST',
                body: body,
            }),
        }),

        // This endpoint is for initiating the WhatsApp Live Chat
        // It will make a request to: [your_backend_url]/api/live-chat/initiate
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