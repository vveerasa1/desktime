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
            invalidatesTags: ['Project']
        }),
        updateProject: builder.mutation({
            query: ({ id, payload }) => ({
                url: URL_CONSTANTS.PROJECTS,
                method: 'POST',
                body: { id, ...payload },
            }),
            invalidatesTags: ['Project'],
        }),

        getAllProjects: builder.query({
            query: ({ id }) => ({
                url: `${URL_CONSTANTS.PROJECTS}/${URL_CONSTANTS.OWNER}/${id}`,
                method: 'GET',
            }),
            providesTags: ['Project']
        }),
        getSingleProject: builder.query({
            query: ({ id }) => ({
                url: `${URL_CONSTANTS.PROJECTS}/${id}`,
                method: 'GET',
            }),
            providesTags: ['Project']

        }),
        deleteProject: builder.mutation({
            query: (id) => ({
                url: `${URL_CONSTANTS.PROJECTS}/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Project'],

        }),
        searchProject: builder.query({
            query: ({ id, searchParams }) => ({
                url: `${URL_CONSTANTS.PROJECTS}/${URL_CONSTANTS.SEARCH}/${id}`,
                method: 'GET',
                params: searchParams

            }),
            providesTags: ['Project']

        }),
    }),
});

// ✅ Export only the hooks you defined
export const {
    useCreateProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
    useGetAllProjectsQuery,
    useGetSingleProjectQuery,
    useSearchProjectQuery
} = Project;
