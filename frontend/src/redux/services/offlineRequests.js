import { createApi } from '@reduxjs/toolkit/query/react';
import { URL_CONSTANTS } from '../../constants/urlConstants';
import customBaseQuery from '../customQuery';
export const OfflineRequest = createApi({
    reducerPath: 'OfflineRequest',
    baseQuery: customBaseQuery,
    tagTypes: ['OfflineRequest','productivity'],
    endpoints: (builder) => ({
        createOfflineRequest: builder.mutation({
            query: (payload) => ({
                url: `${URL_CONSTANTS.DASHBOARD}/${URL_CONSTANTS.OFFLINE_REQUESTS}`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['OfflineRequest','productivity']
        }),
        updateOfflineRequest: builder.mutation({
            query: ({ id, payload }) => ({
                url: `${URL_CONSTANTS.DASHBOARD}/${URL_CONSTANTS.OFFLINE_REQUESTS}`,
                method: 'POST',
                body: { id, ...payload },
            }),
            invalidatesTags: ['OfflineRequest'],
        }),

        getAllOfflineRequest: builder.query({
            query: ({ id }) => ({
                url: `${URL_CONSTANTS.DASHBOARD}/${URL_CONSTANTS.OFFLINE_REQUESTS}/${URL_CONSTANTS.OWNER}/${id}`,
                method: 'GET',
            }),
            providesTags: ['OfflineRequest']
        }),
        getSingleOfflineRequest: builder.query({
            query: ({ id }) => ({
                url: `${URL_CONSTANTS.DASHBOARD}/${URL_CONSTANTS.OFFLINE_REQUESTS}/${id}`,
                method: 'GET',
            }),
            providesTags: ['OfflineRequest']

        }),
        deleteOfflineRequest: builder.mutation({
            query: (id) => ({
                url: `${URL_CONSTANTS.DASHBOARD}/${URL_CONSTANTS.OFFLINE_REQUESTS}/${id}`,
                method:'DELETE'
            }),
            invalidatesTags: ['OfflineRequest'],

        })
    }),
});

// ✅ Export only the hooks you defined
export const {
    // useCreateOfflineRequestMutation,
    useUpdateOfflineRequestMutation,
    useDeleteOfflineRequestMutation,
    useGetAllOfflineRequestQuery,
    useGetSingleOfflineRequestQuery,
} = OfflineRequest;
