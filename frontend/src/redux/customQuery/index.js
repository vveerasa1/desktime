import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { URL_CONSTANTS } from '../../constants/urlConstants';

const baseQuery = fetchBaseQuery({
  baseUrl: URL_CONSTANTS.BASE_URL, // you can import from constants too
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
});

const customBaseQuery = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // Unauthorized — log out the user
    // localStorage.removeItem('token');
    // window.location.href = '/';
    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken) {
      // Attempt to refresh the token
      const refreshResult = await baseQuery(
        {
          url: 'auth/refresh',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult?.data?.accessToken) {
        // Save new access token
        localStorage.setItem('token', refreshResult.data.accessToken);

        // Retry the original request with new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed — log out the user
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
      }
    } else {
      // No refresh token — log out
      localStorage.removeItem('token');
      window.location.href = '/';
    }
  }

  // if (result?.error?.status === 403) {
  //   const refreshToken = localStorage.getItem('refreshToken');

  //   if (refreshToken) {
  //     // Attempt to refresh the token
  //     const refreshResult = await baseQuery(
  //       {
  //         url: 'auth/refresh',
  //         method: 'POST',
  //         body: { refreshToken },
  //       },
  //       api,
  //       extraOptions
  //     );

  //     if (refreshResult?.data?.accessToken) {
  //       // Save new access token
  //       localStorage.setItem('token', refreshResult.data.accessToken);

  //       // Retry the original request with new token
  //       result = await baseQuery(args, api, extraOptions);
  //     } else {
  //       // Refresh failed — log out the user
  //       localStorage.removeItem('token');
  //       localStorage.removeItem('refreshToken');
  //       window.location.href = '/';
  //     }
  //   } else {
  //     // No refresh token — log out
  //     localStorage.removeItem('token');
  //     window.location.href = '/';
  //   }
  // }

  return result;
};


export default customBaseQuery;
