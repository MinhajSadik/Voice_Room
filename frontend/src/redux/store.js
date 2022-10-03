import { configureStore } from "@reduxjs/toolkit";
import auth from "./features/userSlice";

export const store = configureStore({
  reducer: {
    auth,
  },
});
