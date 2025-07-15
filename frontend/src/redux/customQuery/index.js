import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { URL_CONSTANTS } from '../../constants/urlConstants';

const baseQuery = fetchBaseQuery({
  baseUrl: URL_CONSTANTS.BASE_URL,
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
    console.log("⛔ 401 Unauthorized - attempting to refresh token...");

    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken) {
      console.log("🔄 Found refreshToken:", refreshToken);

      try {
        const refreshResult = await fetch(`${URL_CONSTANTS.BASE_URL}auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        const refreshData = await refreshResult.json();

        if (refreshData?.data?.accessToken) {
          const newAccessToken = refreshData.data.accessToken;

          // ✅ Store the new access token
          localStorage.setItem('token', newAccessToken);
          console.log("✅ New access token saved.");

          // --- FIX STARTS HERE ---
          // Re-create the headers object to ensure the new token is used
          const newHeaders = new Headers();
          newHeaders.set('Content-Type', 'application/json'); // Add any other default headers
          newHeaders.set('Authorization', `Bearer ${newAccessToken}`);

          
          result = await baseQuery(args, api, extraOptions); // This call *should* re-run prepareHeaders and pick up the new token.
          console.log("🔄 Retried original request with new token.");
          window.location.reload();
          // --- FIX ENDS HERE ---


        } else {
          console.log("❌ Refresh failed. Logging out.");
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/';
        }
      } catch (err) {
        console.error("❌ Refresh token request failed:", err);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
      }
    } else {
      console.log("❌ No refresh token found. Logging out.");
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/';
    }
  }

  return result;
};

export default customBaseQuery;