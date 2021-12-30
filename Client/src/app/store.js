import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import taskReducer from '../features/task/taskSlice';
import pinReducer from '../features/pin/pinSlice';
export const store = configureStore({
  reducer: {
    user: userReducer,
    task: taskReducer,
    pin: pinReducer,
  },
});
