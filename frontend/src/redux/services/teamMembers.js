import { createApi } from '@reduxjs/toolkit/query/react';
import { URL_CONSTANTS } from '../../constants/urlConstants';
import customBaseQuery from '../customQuery';
export const TeamMembers = createApi({
    reducerPath: 'TeamMembers',
    baseQuery: customBaseQuery,
    tagTypes: ['TeamMembers'],
    endpoints: (builder) => ({
        getAllTeamMembers: builder.query({
            query: ( {id} ) => ({
                url: `${URL_CONSTANTS.TRACKING}/${URL_CONSTANTS.SESSION}/${id}/${URL_CONSTANTS.TODAY}`,
                method: 'GET',
            }),
            providesTags: ['TeamMembers']
        }),

    }),
});

export const {
    useGetAllTeamMembersQuery,
} = TeamMembers;
