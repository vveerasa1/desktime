import { configureStore } from "@reduxjs/toolkit";
import { User } from "../services/userService";
import { Dashboard } from "../services/dashboardService";
export const store = configureStore({
    reducer:{
        [User.reducerPath]:User.reducer,
        [Dashboard.reducerPath]:Dashboard.reducer
    },
   middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(User.middleware,Dashboard.middleware)
})
