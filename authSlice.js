import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: localStorage.getItem("adminToken") || null,
  role: localStorage.getItem("userRole") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      const { email, token, role } = action.payload;
      state.user = email;
      state.token = token;
      state.role = role;
      localStorage.setItem("adminToken", token);
      localStorage.setItem("userRole", role);
    },
    logOut(state) {
      state.user = null;
      state.token = null;
      state.role = null;
      localStorage.removeItem("adminToken");
      localStorage.removeItem("userRole");
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;
