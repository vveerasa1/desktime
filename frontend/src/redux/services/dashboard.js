
import { createApi } from '@reduxjs/toolkit/query/react';
import { URL_CONSTANTS } from '../../constants/urlConstants';
import customBaseQuery from '../customQuery';

export const Dashboard = createApi({
  reducerPath: 'Dashboard',
  baseQuery: customBaseQuery,
  tagTypes: ['Dashboard', 'productivity'],
  endpoints: (builder) => ({
    getScreenshot: builder.query({
      query: ({ id, date }) => ({
        url: `${URL_CONSTANTS.USER}/${id}/${URL_CONSTANTS.SCREENSHOT}`,
        method: 'GET',
        params: { date, id: id }

      }),
    }),

    getDashboardData: builder.query({
      query: ({ day, date, userId }) => ({
        url: `${URL_CONSTANTS.DASHBOARD}`,
        method: 'GET',
        params: {
          type: day,
          date: date,
          userId: userId
        }

      }),
    }),

    getProductivityData: builder.query({
      query: ({ day, date, userId }) => ({
        url: `${URL_CONSTANTS.DASHBOARD}/${URL_CONSTANTS.PRODUCTIVITY}`,
        method: 'GET',
        params: {
          type: day,
          date: date,
          userId: userId

        }
      }),
      providesTags: ['Dashboard', 'productivity'],
    }),
    createOfflineRequest: builder.mutation({
      query: (payload) => ({
        url: `${URL_CONSTANTS.OFFLINE_REQUESTS}`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['productivity']
    }),
    updateOfflineRequest: builder.mutation({
      query: ({ id, payload }) => ({
        url: `${URL_CONSTANTS.OFFLINE_REQUESTS}/${id}`,
        method: 'PUT',
        body: payload
      }),
      invalidatesTags: ['productivity'],
    }),

    getAllOfflineRequest: builder.query({
      query: ({ id, status,date }) => ({
        url: `${URL_CONSTANTS.OFFLINE_REQUESTS}/${id}?status=${status}`,
        method: 'GET',
        params: {
          date:date
        }

      }),
      providesTags: ['productivity']
    }),
    getSingleOfflineRequest: builder.query({
      query: ({ id }) => ({
        url: `${URL_CONSTANTS.DASHBOARD}/${URL_CONSTANTS.OFFLINE_REQUESTS}/${id}`,
        method: 'GET',
      }),
      providesTags: ['productivity']

    }),
    deleteOfflineRequest: builder.mutation({
      query: (id) => ({
        url: `${URL_CONSTANTS.DASHBOARD}/${URL_CONSTANTS.OFFLINE_REQUESTS}/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['productivity'],

    })
  }),
});

export const { useCreateOfflineRequestMutation,
  useGetScreenshotQuery,
  useGetDashboardDataQuery,
  useGetProductivityDataQuery,
   useUpdateOfflineRequestMutation,
    useDeleteOfflineRequestMutation,
    useGetAllOfflineRequestQuery,
    useGetSingleOfflineRequestQuery,
} = Dashboard;
