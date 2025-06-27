import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { URL_CONSTANTS } from '../../constants/urlConstants';

export const User = createApi({
  reducerPath: 'User',
  baseQuery: fetchBaseQuery({ baseUrl: URL_CONSTANTS.BASE_URL }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    createProfile: builder.mutation({
      query: (profileData) => ({
        url: URL_CONSTANTS.USER,
        method: 'POST',
        body: profileData,
      }),
    }),
    updateProfile: builder.mutation({
      query: ({id,profileData}) => ({
        url: `${URL_CONSTANTS.USER}/${id}`,
        method: 'PUT',
        body: profileData,
      }),
    }),
    getAllProfile:builder.query({
        query:()=>({
            url:URL_CONSTANTS.USER,
            method:'GET',
        })
    }),
    getSingleProfile:builder.query({
        query:(id)=>({
            url:`${URL_CONSTANTS.USER}/${id}`,
            method:'GET',
        })
    })
  }),
});

// ✅ Export only the hooks you defined
export const {
  useCreateProfileMutation,
  useUpdateProfileMutation,
  useGetAllProfileQuery,
  useGetSingleProfileQuery
} = User;
