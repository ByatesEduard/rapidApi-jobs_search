import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import rapidReducer from './features/auth/rapidSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    rapid: rapidReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
