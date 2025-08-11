import { createApi } from '@reduxjs/toolkit/query/react';
import { URL_CONSTANTS } from '../../constants/urlConstants';
import customBaseQuery from '../customQuery';
export const Team = createApi({
    reducerPath: 'Team',
    baseQuery: customBaseQuery,
    tagTypes: ['Team'],
    endpoints: (builder) => ({
        createTeam: builder.mutation({
            query: (payload) => ({
                url: URL_CONSTANTS.TEAMS,
                method: 'POST',
                body: payload
            }),
            invalidatesTags: ['Team']
        }),

        updateTeam: builder.mutation({
            query: ({ id, payload }) => ({
                url: `${URL_CONSTANTS.TEAMS}/${id}`,
                method: 'PUT',
                body: payload
            }),
            invalidatesTags: ['Team']
        }),
        deleteTeam: builder.mutation({
            query: (id) => ({
                url: `${URL_CONSTANTS.TEAMS}/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Team']
        }),
        getAllTeam: builder.query({
            query: (id) => ({
                url: `${URL_CONSTANTS.TEAMS}/${URL_CONSTANTS.OWNER}/${id}`,
                method: 'GET',
            }),
            providesTags: ['Team']
        }),

        getSingleTeam: builder.query({
            query: ({ id }) => ({
                url: `${URL_CONSTANTS.TEAMS}/${id}`,
                method: 'GET',
            }),
            providesTags: ['Team']
        }),
        searchTeam: builder.query({
            query: ({ id, searchParams }) => ({
                url: `${URL_CONSTANTS.TEAMS}/${URL_CONSTANTS.SEARCH}/${id}`,
                method: 'GET',
                params: searchParams

            }),
            providesTags: ['Team']

        }),

    }),
});

export const {
    useCreateTeamMutation,
    useUpdateTeamMutation,
    useGetAllTeamQuery,
    useGetSingleTeamQuery,
    useDeleteTeamMutation,
    useSearchTeamQuery
} = Team;
