import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { gameReducer } from './slices/gameSlice';
import { networkMiddleware } from './middleware/network';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { migrationTransform, entityRegistryTransform } from './utils/persistenceTransforms';

// Configuration for redux-persist
const persistConfig = {
  key: 'devhangout',
  storage,
  // Only persist specific parts of the state
  whitelist: ['game'],
  // Apply our custom transforms
  transforms: [migrationTransform, entityRegistryTransform],
  // Debounce writes to improve performance
  debounce: 1000,
  // Version for potential future migrations
  version: 1,
};

const rootReducer = combineReducers({
  game: gameReducer,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          'game/updateCharacterPosition',
          FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER
        ],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.callback'],
        // Ignore these paths in the state
        ignoredPaths: [
          'game.interactables.entities.*.data',
          'game.entityRegistry.entities',
          'game.entityRegistry.relationships'
        ],
      },
    }).concat(networkMiddleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
