import { createApi } from '@reduxjs/toolkit/query/react';
import { URL_CONSTANTS } from '../../constants/urlConstants';
import customBaseQuery from '../customQuery';
export const User = createApi({
  reducerPath: 'User',
  baseQuery: customBaseQuery,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    createProfile: builder.mutation({
      query: (profileData) => ({
        url: URL_CONSTANTS.USER,
        method: 'POST',
        body: profileData,
      }),
      invalidatesTags:['User']
    }),
    updateProfile: builder.mutation({
      query: ({id,profileData}) => ({
        url: `${URL_CONSTANTS.USER}/${id}`,
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags:['User']
    }),
    getAllProfile:builder.query({
        query:()=>({
            url:URL_CONSTANTS.USER,
            method:'GET',
        }),
        providesTags:['User']
    }),
    getSingleProfile:builder.query({
        query:(id)=>({
            url:`${URL_CONSTANTS.USER}/${id}`,
            method:'GET',
        }),
        providesTags:['User']

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
