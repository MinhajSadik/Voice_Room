import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",

  initialState: {
    isLoggedIn: false,
    user: null,
    otp: {
      phone: "",
      hash: "",
    },
  },

  reducers: {
    setUser: (state, { payload }) => {
      const { user } = payload;
      state.user = user;
      if (user === null) {
        state.isLoggedIn = false;
      } else {
        state.isLoggedIn = true;
      }
    },
    setOtp: (state, { payload }) => {
      const { phone, hash } = payload;
      state.otp.phone = phone;
      state.otp.hash = hash;
      state.isLoggedIn = false;
    },
  },
  extraReducers: {},
});

export const { setUser, setOtp } = userSlice.actions;

export default userSlice.reducer;
