import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { URL_CONSTANTS } from '../../constants/urlConstants';

export const Dashboard = createApi({
  reducerPath: 'Dashboard',
  baseQuery: fetchBaseQuery({ baseUrl: URL_CONSTANTS.BASE_URL }),
  tagTypes: ['Dashboard'],
  endpoints: (builder) => ({
    getScreenshot:builder.query({
        query:({id,date})=>({
            url:`${URL_CONSTANTS.USER}/${id}/${URL_CONSTANTS.SCREENSHOT}`,
            method:'GET',
            params:{
                date:date
            }
        })
    }),
    getDashboardData:builder.query({
      query:({token,day})=>({
            url:`${URL_CONSTANTS.DASHBOARD}`,
            method:'GET',
            params:{
                type:day
            },
            headers:{
              'Authorization':`Bearer ${token}`
            }
        })
    })
  }),
});

// ✅ Export only the hooks you defined
export const {
    useGetScreenshotQuery,
    useGetDashboardDataQuery
} = Dashboard;
