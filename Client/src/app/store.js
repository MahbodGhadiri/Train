import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import taskReducer from '../features/task/taskSlice';
import pinReducer from '../features/pin/pinSlice';
import singleTaskReducer from '../features/task/singleTaskSlice';
import logReducer from "../features/log/logSlice"
export const store = configureStore({
  reducer: {
    user: userReducer,
    task: taskReducer,
    pin: pinReducer,
    singleTask: singleTaskReducer,
    log : logReducer,
  },
});
