import { configureStore } from "@reduxjs/toolkit";
import { User } from "../services/user";
import { Login } from "../services/login";
import { Dashboard } from "../services/dashboard";
import { Team } from "../services/team";
import { Project } from '../services/projects'
import { Task } from "../services/task";
import { OfflineRequest } from '../services/offlineRequests'
import { TeamMembers } from "../services/teamMembers";
export const store = configureStore({
  reducer: {
    [User.reducerPath]: User.reducer,
    [Login.reducerPath]: Login.reducer,
    [Dashboard.reducerPath]: Dashboard.reducer,
    [Team.reducerPath]: Team.reducer,
    [Project.reducerPath]: Project.reducer,
    [Task.reducerPath]: Task.reducer,
    [OfflineRequest.reducerPath]: OfflineRequest.reducer,
    [TeamMembers.reducerPath]: TeamMembers.reducer,


  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      User.middleware,
      Login.middleware,
      Dashboard.middleware,
      Team.middleware,
      Project.middleware,
      Task.middleware,
      OfflineRequest.middleware,
      TeamMembers.middleware
    )
})
