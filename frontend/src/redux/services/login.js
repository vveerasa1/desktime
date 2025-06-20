import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { URL_CONSTANTS } from '../../constants/urlConstants';

export const Login = createApi({
    reducerPath: 'login',
    baseQuery: fetchBaseQuery({ baseUrl: URL_CONSTANTS.BASE_URL }),
    tagTypes: ['login'],
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (loginInfo) => ({
                url: `${URL_CONSTANTS.AUTH}/${URL_CONSTANTS.LOGIN}`,
                method: 'POST',
                body: loginInfo,
            }),
        }),

    }),
});

// ✅ Export only the hooks you defined
export const {
    useLoginMutation
} = Login;
