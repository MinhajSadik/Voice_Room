import { configureStore } from "@reduxjs/toolkit";
import activate from "./features/activateSlice";
import auth from "./features/userSlice";

export const store = configureStore({
  reducer: {
    auth,
    activate,
  },
});
