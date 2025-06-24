import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { URL_CONSTANTS } from '../../constants/urlConstants';

// Fetch tokens from localStorage (since login is under process)
const baseQuery = fetchBaseQuery({
  baseUrl: URL_CONSTANTS.BASE_URL,
  prepareHeaders: (headers) => {
    const accessToken = localStorage.getItem('accessToken'); // hardcoded token for now
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If token is expired
  if (result?.error?.status === 401) {
    const refreshToken = localStorage.getItem('refreshToken');
    const refreshResponse = await baseQuery(
      {
        url: '/auth/refresh',
        method: 'POST',
        body: { refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResponse?.data?.accessToken) {
      localStorage.setItem('accessToken', refreshResponse.data.accessToken);

      // Retry original request with new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.warn('Refresh token expired or invalid');
    }
  }

  return result;
};

export const Dashboard = createApi({
  reducerPath: 'Dashboard',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Dashboard'],
  endpoints: (builder) => ({
    getScreenshot: builder.query({
      query: ({ id, date }) => ({
        url: `${URL_CONSTANTS.USER}/${id}/${URL_CONSTANTS.SCREENSHOT}`,
        method: 'GET',
        params: { date },
      }),
    }),
    getDashboardByType: builder.query({
      query: (type) => ({
        url: '/dashboard',
        method: 'GET',
        params: { type },
      }),
    }),
  }),
});

// ✅ Export hooks
export const {
  useGetScreenshotQuery,
  useGetDashboardByTypeQuery,
} = Dashboard;
