import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authState/authSlice";

export const store = configureStore({
  reducer: { authReducer: authSlice },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
