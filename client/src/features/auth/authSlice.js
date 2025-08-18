// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  userInfo: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.userInfo = {
        email: action.payload.email,
        role: action.payload.role,
      };
    },
    logout: (state) => {
      state.token = null;
      state.userInfo = null;
      localStorage.removeItem("adminToken");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
