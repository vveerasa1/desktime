
import { createApi } from '@reduxjs/toolkit/query/react';
import { URL_CONSTANTS } from '../../constants/urlConstants';
import customBaseQuery from '../customQuery';

export const Dashboard = createApi({
  reducerPath: 'Dashboard',
  baseQuery: customBaseQuery,
  tagTypes: ['Dashboard'],
  endpoints: (builder) => ({
    getScreenshot: builder.query({
      query: ({ id, date, userId }) => ({
        url: `${URL_CONSTANTS.USER}/${id}/${URL_CONSTANTS.SCREENSHOT}`,
        method: 'GET',
        params: { date,userId }
        
      }),
    }),

    getDashboardData: builder.query({
      query: ({ day, date, userId }) => ({
        url: `${URL_CONSTANTS.DASHBOARD}`,
        method: 'GET',
        params: {
          type: day,
          date: date,
          userId:userId
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
    }),
  }),
});

export const {
  useGetScreenshotQuery,
  useGetDashboardDataQuery,
  useGetProductivityDataQuery,
} = Dashboard;
