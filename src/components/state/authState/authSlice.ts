import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface authState {
  isAuthorized: boolean;
  redirected: string;
  id: string;
  user: string;
}

const initialState: authState = {
  isAuthorized: false,
  redirected: "",
  user: "",
  id: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<string>) => {
      state.user = action.payload;
    },
    setAuthorized: (state, action: PayloadAction<boolean>) => {
      state.isAuthorized = action.payload;
    },
    setRedirected: (state, action: PayloadAction<string>) => {
      state.redirected = action.payload;
    },
    setId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
  },
});

export const { setAuthorized, setRedirected, setUser, setId } =
  authSlice.actions;

export default authSlice.reducer;
