import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { migrationTransform, entityRegistryTransform } from './utils/persistenceTransforms';
import { GameState } from './types';
import gameReducer from './slices/gameSlice';
import authReducer from './slices/authSlice';

// Define root state type
export type RootState = {
  game: GameState;
  auth: ReturnType<typeof authReducer>;
};

// Configure persistence
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  // Only persist specific parts of the state
  whitelist: ['game', 'auth'],
  // Apply our custom transforms
  transforms: [migrationTransform, entityRegistryTransform],
};

// Combine reducers
const rootReducer = combineReducers({
  game: gameReducer,
  auth: authReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'game/updateCharacterPosition',
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          'persist/PERSIST',
          'persist/REHYDRATE',
        ],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp', 'meta.arg'],
      },
    }),
});

export const persistor = persistStore(store);

// Export types
export type AppDispatch = typeof store.dispatch;
