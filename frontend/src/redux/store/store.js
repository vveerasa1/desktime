import { configureStore } from "@reduxjs/toolkit";
import { User } from "../services/user";
import { Dashboard } from "../services/dashboard";
export const store = configureStore({
    reducer:{
        [User.reducerPath]:User.reducer,
        [Dashboard.reducerPath]:Dashboard.reducer
    },
   middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(User.middleware,Dashboard.middleware)
})
