import { configureStore } from "@reduxjs/toolkit";
import { User } from "../services/user";
import { Login } from "../services/login";
import { Dashboard } from "../services/dashboard";
export const store = configureStore({
  reducer: {
    [User.reducerPath]: User.reducer,
    [Login.reducerPath]: Login.reducer,
        [Dashboard.reducerPath]:Dashboard.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      User.middleware,
      Login.middleware
    ,Dashboard.middleware)
})
