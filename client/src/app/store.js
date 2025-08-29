import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import { apiSlice } from "../features/api/apiSlice";
import { jobApi } from "../features/auth/jobApi";
import { jobApplicationApi } from "../features/auth/jobApplicationApi";
import { blogApi } from "../features/auth/blogApi";
import { contactApi } from "../features/auth/contactApi"; // Adjust path
import { contactUsApi } from "../features/auth/contactUs"; // Your contact API
import { reelApi } from "../features/auth/reelApi"; // Import reelApi
import { chatbotApi } from "../features/auth/chatBot"; // Import chatbotApi if needed
import { userApi } from '../features/auth/userApi'; // Adjust path if needed
import { mediaApi } from "../features/auth/mediaApi";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [jobApi.reducerPath]: jobApi.reducer,
    [jobApplicationApi.reducerPath]: jobApplicationApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer, // Add blogApi reducer
    [contactApi.reducerPath]: contactApi.reducer,
    [contactUsApi.reducerPath]: contactUsApi.reducer,
     [userApi.reducerPath]: userApi.reducer,
    [chatbotApi.reducerPath]: chatbotApi.reducer,
    [mediaApi.reducerPath]: mediaApi.reducer,
    // Make sure this is present
    [reelApi.reducerPath]: reelApi.reducer, // Add reelApi reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware)
      .concat(jobApi.middleware) // 👈 Add jobApi middleware
      .concat(jobApplicationApi.middleware)
      .concat(blogApi.middleware)
      .concat(contactApi.middleware)
      .concat(chatbotApi.middleware)
      .concat(contactUsApi.middleware)
      .concat(reelApi.middleware)
      .concat(mediaApi.middleware)
      .concat(userApi.middleware), // Add reelApi middleware
});
