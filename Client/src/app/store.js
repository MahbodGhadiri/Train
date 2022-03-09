import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import adminTasksReducer from '../features/task/adminTasksSlice';
import userTasksReducer from '../features/task/userTasksSlice';
import customTasksReducer from '../features/task/customTasksSlice';
import pinReducer from '../features/pin/pinSlice';
import singleTaskReducer from '../features/task/singleTaskSlice';
import logReducer from "../features/log/logSlice"
export const store = configureStore({
  reducer: {
    user: userReducer,
    adminTasks: adminTasksReducer,
    userTasks: userTasksReducer,
    customTasks: customTasksReducer,
    pin: pinReducer,
    singleTask: singleTaskReducer,
    log : logReducer,
  },
});
