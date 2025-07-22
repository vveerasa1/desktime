import { createApi } from '@reduxjs/toolkit/query/react';
import { URL_CONSTANTS } from '../../constants/urlConstants';
import customBaseQuery from '../customQuery';
export const Project = createApi({
  reducerPath: 'Project',
  baseQuery: customBaseQuery,
  tagTypes: ['Project'],
  endpoints: (builder) => ({
    createProject: builder.mutation({
      query: (payload) => ({
        url: URL_CONSTANTS.PROJECTS,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags:['Project']
    }),
    // updateProfile: builder.mutation({
    //   query: ({id,profileData}) => ({
    //     url: `${URL_CONSTANTS.USER}/${id}`,
    //     method: 'PUT',
    //     body: profileData,
    //   }),
    //   invalidatesTags:['User']
    // }),
    getAllProjects:builder.query({
        query:({id})=>({
            url:`${URL_CONSTANTS.PROJECTS}/${URL_CONSTANTS.OWNER}/${id}`,
            method:'GET',
        }),
        providesTags:['Project']
    }),
    // getSingleProfile:builder.query({
    //     query:(id)=>({
    //         url:`${URL_CONSTANTS.USER}/${id}`,
    //         method:'GET',
    //     }),
    //     providesTags:['User']

    // })
  }),
});

// ✅ Export only the hooks you defined
export const {
    useCreateProjectMutation,
    useGetAllProjectsQuery
} = Project;
