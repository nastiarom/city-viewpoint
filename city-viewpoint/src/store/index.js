import { configureStore } from '@reduxjs/toolkit';
import cityReducer from './citySlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    cities: cityReducer,
    auth: authReducer,
  },
});
