import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { URL_CONSTANTS } from "../../constants/urlConstants";

export const Login = createApi({
  reducerPath: "login",
  baseQuery: fetchBaseQuery({ baseUrl: URL_CONSTANTS.ELECTRON_BASE_URL }),
  tagTypes: ["login"],
  endpoints: (builder) => ({
    session: builder.mutation({
      query: ({ token, userId, refreshToken }) => ({
        url: `${URL_CONSTANTS.STORE_TOKEN}`,
        method: "POST",
        body: {
          token: token,
          userId: userId,
          refreshToken: refreshToken,
        },
      }),
    }),
    logoutSession: builder.mutation({
      query: ({ userId }) => ({
        url: `${URL_CONSTANTS.LOGOUT}`,
        method: "POST",
        body: {
          userId: userId,
        },
      }),
    }),
  }),
});

// ✅ Export only the hooks you defined
export const { useSessionMutation, useLogoutSessionMutation } = Login;
