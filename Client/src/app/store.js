import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import taskReducer from '../features/task/taskSlice';
import pinReducer from '../features/pin/pinSlice';
import singleTaskReducer from '../features/task/singleTaskSlice'
export const store = configureStore({
  reducer: {
    user: userReducer,
    task: taskReducer,
    pin: pinReducer,
    singleTask: singleTaskReducer,
  },
});
