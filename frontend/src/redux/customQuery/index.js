import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { URL_CONSTANTS } from '../../constants/urlConstants';

const baseQuery = fetchBaseQuery({
  baseUrl:URL_CONSTANTS.BASE_URL, // you can import from constants too
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
});

const customBaseQuery = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 401) {
    // localStorage.removeItem('token');

    // window.location.href = '/';
  }

  return result;
};

export default customBaseQuery;
