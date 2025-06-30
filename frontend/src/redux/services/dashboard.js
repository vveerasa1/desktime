import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { URL_CONSTANTS } from '../../constants/urlConstants';

export const Dashboard = createApi({
  reducerPath: 'Dashboard',
  baseQuery: fetchBaseQuery({
    baseUrl: URL_CONSTANTS.BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Dashboard'],
  endpoints: (builder) => ({
    getScreenshot: builder.query({
      query: ({ id, date }) => ({
        url: `${URL_CONSTANTS.USER}/${id}/${URL_CONSTANTS.SCREENSHOT}`,
        method: 'GET',
        params: { date },
      }),
    }),

    getDashboardData: builder.query({
      query: ({ day, date }) => {
        // const params = date
        //   ? { type: day, date: date }  // if date exists, include both
        //   : { type: day };             // otherwise only type

        return {
          url: `${URL_CONSTANTS.DASHBOARD}`,
          method: 'GET',
          params:{
            type: day,
            date:date
          },
        };
      },
    }),
    getProductivityData: builder.query({
      query: ({ day, date }) => {
        // const params = date
        //   ? { type: day, date: date } 
        //   : { type: day };           

        return {
          url: `${URL_CONSTANTS.DASHBOARD}/${URL_CONSTANTS.PRODUCTIVITY}`,
          method: 'GET',
         params:{
            type: day,
            date:date
          },
        };
      },
    }),

  }),
});

export const {
  useGetScreenshotQuery,
  useGetDashboardDataQuery,
  useGetProductivityDataQuery,
} = Dashboard;
