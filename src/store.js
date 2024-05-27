import { configureStore } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    id: null,
    email: null,
    username: null,
    role: null,
  },
  reducers: {
    login: (state, action) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.username = action.payload.username;
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.id = null;
      state.email = null;
      state.username = null;
      state.role = null;
    },
    changeUsername: (state, action) => {
      state.username = action.payload;
    },
    changeRole: (state, action) => {
      state.role = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout, changeUsername, changeRole } = authSlice.actions;

export const authReducer = authSlice.reducer;

export default configureStore({
  reducer: {
    auth: authReducer,
  },
});
