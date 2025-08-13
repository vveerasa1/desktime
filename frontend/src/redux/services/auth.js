import { createApi } from '@reduxjs/toolkit/query/react';
import { URL_CONSTANTS } from '../../constants/urlConstants';
import customBaseQuery from '../customQuery';
export const Auth = createApi({
    reducerPath: 'Auth',
    baseQuery: customBaseQuery,
    tagTypes: ['Auth'],
    endpoints: (builder) => ({
        sendOtp: builder.mutation({
            query: (payload) => ({
                url: `${URL_CONSTANTS.AUTH}/${URL_CONSTANTS.SENDOTP}`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['Auth']
        }),
        verifyOtp: builder.mutation({
            query: (payload) => ({
                url: `${URL_CONSTANTS.AUTH}/${URL_CONSTANTS.VERIFYOTP}`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['Auth']
        }),
        resetPassword: builder.mutation({
            query: (payload) => ({
                url: `${URL_CONSTANTS.USER}/${URL_CONSTANTS.RESET}/${URL_CONSTANTS.PASSWORD}`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['Auth']
        }),
        // updateOfflineRequest: builder.mutation({
        //     query: ({ id, payload }) => ({
        //         url:`${URL_CONSTANTS.OFFLINE_REQUESTS}/${id}`,
        //         method: 'PUT',
        //         body: payload 
        //     }),
        //     invalidatesTags: ['OfflineRequest'],
        // }),

        // getAllOfflineRequest: builder.query({
        //     query: ({ id,status }) => ({
        //         url: `${URL_CONSTANTS.OFFLINE_REQUESTS}/${id}?status=${status}`,
        //         method: 'GET',
                
        //     }),
        //     providesTags: ['OfflineRequest']
        // }),
        // getSingleOfflineRequest: builder.query({
        //     query: ({ id }) => ({
        //         url: `${URL_CONSTANTS.DASHBOARD}/${URL_CONSTANTS.OFFLINE_REQUESTS}/${id}`,
        //         method: 'GET',
        //     }),
        //     providesTags: ['OfflineRequest']

        // }),
        // deleteOfflineRequest: builder.mutation({
        //     query: (id) => ({
        //         url: `${URL_CONSTANTS.DASHBOARD}/${URL_CONSTANTS.OFFLINE_REQUESTS}/${id}`,
        //         method:'DELETE'
        //     }),
        //     invalidatesTags: ['OfflineRequest'],

        // })
    }),
});

// ✅ Export only the hooks you defined
export const {
        useSendOtpMutation,
        useVerifyOtpMutation,
        useResetPasswordMutation,
    useUpdateOfflineRequestMutation,
    useDeleteOfflineRequestMutation,
    useGetAllOfflineRequestQuery,
    useGetSingleOfflineRequestQuery,
} = Auth;
