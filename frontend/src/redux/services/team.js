import { createApi } from '@reduxjs/toolkit/query/react';
import { URL_CONSTANTS } from '../../constants/urlConstants';
import customBaseQuery from '../customQuery';
export const Team = createApi({
  reducerPath: 'Team',
  baseQuery: customBaseQuery,
  tagTypes: ['Team'],
  endpoints: (builder) => ({
    createTeam: builder.mutation({
      query: (TeamData) => ({
        url: URL_CONSTANTS.USER,
        method: 'POST',
        body: TeamData,
      }),
      invalidatesTags:['Team']
    }),
    
  }),
});

export const {
    useCreateTeamMutation
} = Team;
