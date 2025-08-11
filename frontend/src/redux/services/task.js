import { createApi } from '@reduxjs/toolkit/query/react';
import { URL_CONSTANTS } from '../../constants/urlConstants';
import customBaseQuery from '../customQuery';
export const Task = createApi({
    reducerPath: 'Task',
    baseQuery: customBaseQuery,
    tagTypes: ['Task'],
    endpoints: (builder) => ({
        createTask: builder.mutation({
            query: (payload) => ({
                url: URL_CONSTANTS.TASK,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['Task']
        }),
        updateTask: builder.mutation({
            query: ({ id, payload }) => ({
                url: URL_CONSTANTS.TASK,
                method: 'POST',
                body: { id, ...payload },
            }),
            invalidatesTags: ['Task'],
        }),

        getAllTasks: builder.query({
            query: ({ id }) => ({
                url: `${URL_CONSTANTS.TASK}/${URL_CONSTANTS.OWNER}/${id}`,
                method: 'GET',
            }),
            providesTags: ['Task']
        }),
        getSingleTask: builder.query({
            query: ({ id }) => ({
                url: `${URL_CONSTANTS.TASK}/${id}`,
                method: 'GET',
            }),
            providesTags: ['Task']

        }),
        deleteTask: builder.mutation({
            query: (id) => ({
                url: `${URL_CONSTANTS.TASK}/${id}`,
                method:'DELETE'
            }),
            invalidatesTags: ['Task'],

        }),
         searchTask: builder.query({
                    query: ({ id, searchParams }) => ({
                        url: `${URL_CONSTANTS.TASK}/${URL_CONSTANTS.SEARCH}/${id}`,
                        method: 'GET',
                        params: searchParams
        
                    }),
                    providesTags: ['Task']
        
                }),
    }),
});

// ✅ Export only the hooks you defined
export const {
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
    useGetAllTasksQuery,
    useGetSingleTaskQuery,
    useSearchTaskQuery
} = Task;
