import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Use Vite's syntax to access the environment variable
const BASE_URL = import.meta.env.VITE_API_URL;

export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['Blog'], // Used for caching and automatic re-fetching
  endpoints: (builder) => ({
    
    // Query to get all blogs
    getBlogs: builder.query({
      query: () => 'blogs',
      providesTags: ['Blog'], // Provides 'Blog' tag for caching
    }),

    // New: Query to get a single blog by ID
    getBlogById: builder.query({
      query: (id) => `blogs/${id}`,
      providesTags: (result, error, id) => [{ type: 'Blog', id }],
    }),

    // Mutation to add a new blog (including image upload)
    addBlog: builder.mutation({
      query: (formData) => ({
        url: 'blogs',
        method: 'POST',
        body: formData,  
      }),
      // Invalidates the 'Blog' tag, triggering a re-fetch of getBlogs
      invalidatesTags: ['Blog'],  
    }),

    // Mutation to delete a blog
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `blogs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blog'], // Triggers re-fetch after deletion
    }),

    // Mutation to update a blog (Correctly handles 'id' and 'formData')
    updateBlog: builder.mutation({
      // We destructure the 'id' (for the URL) and 'formData' (for the body)
      query: ({ id, formData }) => ({
        url: `blogs/${id}`,  
        method: 'PUT',  
        body: formData, // Send the FormData object (including new image and old imageId)
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Blog', id }], // Invalidate specific blog and all blogs
    }),

    // NEW: Mutation to submit the contact form
    submitContactForm: builder.mutation({
      query: (formData) => ({
        url: 'contact/inquiries', // Corrected to match backend route
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const {  
  useGetBlogsQuery,  
  useGetBlogByIdQuery,  
  useAddBlogMutation,  
  useDeleteBlogMutation,  
  useUpdateBlogMutation,
  useSubmitContactFormMutation // Export the new mutation hook
} = blogApi;