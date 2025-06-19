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
  }),
});

// ✅ Export only the hooks you defined
export const {
    useGetScreenshotQuery,
} = Dashboard;
