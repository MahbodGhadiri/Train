import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../features/user/userSlice';
import profileReducer from '../features/user/ProfileSlice'
import adminTasksReducer from '../features/task/adminTasksSlice';
import userTasksReducer from '../features/task/userTasksSlice';
import customTasksReducer from '../features/task/customTasksSlice';
import pinReducer from '../features/pin/pinSlice';
import logReducer from "../features/log/logSlice"
export const store = configureStore({
  reducer: {
    users: usersReducer,
    profile: profileReducer,
    adminTasks: adminTasksReducer,
    userTasks: userTasksReducer,
    customTasks: customTasksReducer,
    pin: pinReducer,
    log : logReducer,
  },
});
