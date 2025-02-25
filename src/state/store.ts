import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducers';
import { networkMiddleware } from './middleware/network';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(networkMiddleware)
});

export type AppDispatch = typeof store.dispatch; 