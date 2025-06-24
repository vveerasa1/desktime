import { configureStore } from "@reduxjs/toolkit";
import { User } from "../services/user";
import { Login } from "../services/login";

export const store = configureStore({
  reducer: {
    [User.reducerPath]: User.reducer,
    [Login.reducerPath]: Login.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      User.middleware,
      Login.middleware
    ),
})
