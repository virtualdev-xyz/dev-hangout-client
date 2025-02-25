import { configureStore } from '@reduxjs/toolkit';
import { gameReducer } from './slices/gameSlice';
import { networkMiddleware } from './middleware/network';

export const store = configureStore({
  reducer: {
    game: gameReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['game/updateCharacterPosition'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.callback'],
        // Ignore these paths in the state
        ignoredPaths: ['game.interactables.entities.*.data']
      }
    }).concat(networkMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 