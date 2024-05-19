import { configureStore } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    role: null,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
    },
    changeName: (state, action) => {
      state.user = action.payload.name;
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout, changeName } = authSlice.actions;

export const authReducer = authSlice.reducer;

export default configureStore({
  reducer: {
    auth: authReducer,
  },
});
