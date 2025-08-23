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
      const { user, token } = action.payload;
      state.token = token;
      state.userInfo = user; // Store the entire user object
      localStorage.setItem('adminToken', token); // Also save token to localStorage
    },
    logout: (state) => {
      state.token = null;
      state.userInfo = null;
      localStorage.removeItem('adminToken');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
