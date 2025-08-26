import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null, // This will be populated from localStorage on app boot by App.jsx
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      const { user, token } = action.payload;
      state.userInfo = user;
      state.token = token;
      localStorage.setItem("adminToken", token);
    },
    logout(state) {
      state.userInfo = null;
      state.token = null;
      // This is now the single source of truth for clearing the session.
      // The token is removed from localStorage here, not in the UI component.
      localStorage.removeItem("adminToken");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;