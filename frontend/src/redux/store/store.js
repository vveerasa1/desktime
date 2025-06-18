import { configureStore } from "@reduxjs/toolkit";
import { User } from "../services/userService";

export const store = configureStore({
    reducer:{
        [User.reducerPath]:User.reducer,
    },
   middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(User.middleware),
})