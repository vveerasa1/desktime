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
      invalidatesTags: ['User']
    }),
    updateProfile: builder.mutation({
      query: ({ id, profileData }) => ({
        url: `${URL_CONSTANTS.USER}/${id}`,
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['User']
    }),
    getAllProfile: builder.query({
      query: ({ id, search }) => {
        const queryObj = {
          url: `${URL_CONSTANTS.USER}/${URL_CONSTANTS.OWNER}/${id}`,
          method: 'GET',
        };

        if (search) {
          queryObj.params = { search };
        }


        return queryObj;
      },
      providesTags: ['User']
    }),
    getSingleProfile: builder.query({
      query: (id) => ({
        url: `${URL_CONSTANTS.USER}/${id}`,
        method: 'GET',
      }),
      providesTags: ['User']

    }),
     userExist:builder.query({
        query:()=>({
            url:`${URL_CONSTANTS.USER}/exist`,
            method:'GET',
        }),
        providesTags:['User']

    }),
    deleteProfile: builder.mutation({
      query: (id) => ({
        url: `${URL_CONSTANTS.USER}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User']
    }),

  }),

});

// ✅ Export only the hooks you defined
export const {
  useCreateProfileMutation,
  useUpdateProfileMutation,
  useDeleteProfileMutation,
  useGetAllProfileQuery,
  useGetSingleProfileQuery,
  useUserExistQuery
} = User;
