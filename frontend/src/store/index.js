import { configureStore } from "@reduxjs/toolkit";
import activate from "./activateSlice";
import auth from "./authSlice";

export const store = configureStore({
  reducer: {
    auth,
    activate,
  },
});
