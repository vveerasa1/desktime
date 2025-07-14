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

  // If access token has expired
  if (result?.error?.status === 401) {
    console.log("⛔ 401 Unauthorized - attempting to refresh token...");

    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken) {
      console.log("🔄 Found refreshToken:", refreshToken);

      // Send refresh token request
      const refreshResult = await fetch(`${URL_CONSTANTS.BASE_URL}auth/refresh`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
      const refreshData = await refreshResult.json();


      console.log("🔁 Refresh response:", refreshResult);

      if (refreshData?.data?.accessToken) {
        // Store new token
        localStorage.setItem('token', refreshResult.data.accessToken);
        console.log("✅ New access token saved.");

        // Retry the original request with the new token
        // result = await baseQuery(args, api, extraOptions);
        console.log("🔄 Retried original request with new token.");
        // window.location.reload();
      } else {
        console.log("❌ Refresh failed. Logging out.");
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
      }
    } else {
      // No refresh token — log out
      // console.log("❌ No refresh token found. Logging out.");
      // localStorage.removeItem('token');
      // window.location.href = '/';
    }
  }

  return result;
};



export default customBaseQuery;
