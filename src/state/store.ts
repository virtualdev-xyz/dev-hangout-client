import { configureStore, combineReducers, Middleware, AnyAction } from '@reduxjs/toolkit';
import gameReducer from './slices/gameSlice';
import { networkMiddleware } from './middleware/network';
import { persistStore, persistReducer, PersistConfig } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { migrationTransform, entityRegistryTransform } from './utils/persistenceTransforms';
import { GameState } from './types';

// Define root state type
type RootState = {
  game: GameState;
};

// Configuration for redux-persist
const persistConfig: PersistConfig<RootState> = {
  key: 'devhangout',
  storage,
  // Only persist specific parts of the state
  whitelist: ['game'],
  // Apply our custom transforms
  transforms: [migrationTransform, entityRegistryTransform],
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
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({
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
    });
    return middleware.concat(networkMiddleware as Middleware<unknown, RootState>);
  },
});

export const persistor = persistStore(store);

// Export types
export type { RootState };
export type AppDispatch = typeof store.dispatch;
