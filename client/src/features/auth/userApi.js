import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "./authSlice";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      // Get token from local storage
      const token = localStorage.getItem("adminToken");
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Admin'], // Define a tag type for admins
  endpoints: (builder) => ({
    login: builder.mutation({
     query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      // onQueryStarted is the recommended way to handle side effects in RTK Query.
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Explicitly set the token in localStorage to ensure it's available for route guards.
          localStorage.setItem("adminToken", data.token);
          // On successful login, dispatch setCredentials to update the auth state.
          // This will update the user info in the Redux store.
          dispatch(setCredentials({ user: data.user, token: data.token }));
        } catch (error) {
          // The component's error state will handle displaying the error.
          console.error("Login failed onQueryStarted:", error);
        }
      },
      // After a successful login, we want to invalidate any cached 'Admin' data
      // to ensure the UI reflects the correct state for the newly logged-in user.
      invalidatesTags: ["Admin"],
    }),
    logout: builder.mutation({
      queryFn: () => ({ data: {} }), // No backend call needed, this is a client-side only mutation
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        await queryFulfilled; // Wait for the mutation to "complete"
        localStorage.removeItem("adminToken");
        // Dispatching resetApiState will clear all cached data and force a refetch
        // of any active queries, effectively logging the user out.
        dispatch(userApi.util.resetApiState());
      },
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: "/register",
        method: "POST",
        body: credentials,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: "/forgot-password",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation({
      query: (body) => ({
        url: "/reset-password",
        method: "POST",
        body,
      }),
    }),
    // User Management Endpoints
    getAdmins: builder.query({
      query: () => 'admins',
      providesTags: (result = []) => [
        ...result.map(({ _id }) => ({ type: 'Admin', id: _id })),
        { type: 'Admin', id: 'LIST' },
      ],
    }),
    inviteAdmin: builder.mutation({
      // This is the incorrect part: it only takes `email` from the object.
      query: (adminData) => ({ // Corrected: Takes the whole object.
        url: 'admins/invite',
        method: 'POST',
        // This sends the entire object, not just the email.
        body: adminData, 
      }),
      invalidatesTags: [{ type: 'Admin', id: 'LIST' }],
    }),
    updateAdminRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `admins/${id}/role`,
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: [{ type: 'Admin', id: 'LIST' }],
    }),
    updateAdminStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `admins/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: [{ type: 'Admin', id: 'LIST' }],
    }),
    deleteAdmin: builder.mutation({
      query: (id) => ({
        url: `admins/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Admin', id: 'LIST' }],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation, // New hook for logging out
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  // Export new hooks for admin management
  useGetAdminsQuery,
  useInviteAdminMutation,
  useUpdateAdminRoleMutation,
  useUpdateAdminStatusMutation,
  useDeleteAdminMutation,
} = userApi;
