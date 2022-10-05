import { createSlice } from "@reduxjs/toolkit";

export const activateSlice = createSlice({
  name: "activate",

  initialState: {
    name: "",
    avatar: "",
  },

  reducers: {
    setName: (state, { payload }) => {
      state.name = payload;
    },
    setAvatar: (state, { payload }) => {
      state.avatar = payload;
    },
  },
  extraReducers: {},
});

export const { setName, setAvatar } = activateSlice.actions;

export default activateSlice.reducer;
