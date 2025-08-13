import { createApi } from '@reduxjs/toolkit/query/react';
import { URL_CONSTANTS } from '../../constants/urlConstants';
import customBaseQuery from '../customQuery';
export const TeamMembers = createApi({
    reducerPath: 'TeamMembers',
    baseQuery: customBaseQuery,
    tagTypes: ['TeamMembers'],
    endpoints: (builder) => ({
        getAllTeamMembers: builder.query({
            query: ({ id, search,date }) => {
                const queryObj = {
                    url: `${URL_CONSTANTS.TRACKING}/${URL_CONSTANTS.SESSION}/${id}/${URL_CONSTANTS.TODAY}`,
                    method: 'GET',
                    params:{
                        date:date
                    }
                };

                if (search) {
                    queryObj.params = { search };
                }


                return queryObj;
            },
            providesTags: ['TeamMembers'],
        }),
        getAllSnapShot: builder.query({
            query: ({id}) => ({
                url: `${URL_CONSTANTS.TRACKING}/${URL_CONSTANTS.SESSION}/${URL_CONSTANTS.SNAPSHOT}/${id}`,
                method: 'GET',
            }),
            providesTags: ['TeamMembers']

        }),

    }),
});

export const {
    useGetAllTeamMembersQuery,
    useGetAllSnapShotQuery,
} = TeamMembers;
