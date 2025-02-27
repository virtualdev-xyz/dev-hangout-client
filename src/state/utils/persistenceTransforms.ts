import { createTransform } from 'redux-persist';
import { RootState } from '../store';

/**
 * Transform to handle migrations between different versions of the state structure
 */
export const migrationTransform = createTransform(
  // transform state on its way to being serialized and persisted
  (inboundState, key) => {
    // Add app version to state for future migrations
    if (key === 'game') {
      return {
        ...inboundState,
        _persistVersion: process.env.npm_package_version || '1.0.0',
      };
    }
    return inboundState;
  },
  
  // transform state being rehydrated
  (outboundState, key) => {
    if (key === 'game') {
      const persistedVersion = (outboundState as any)._persistVersion || '1.0.0';
      const currentVersion = process.env.npm_package_version || '1.0.0';
      
      // In the future, we can add migration logic here
      // if (persistedVersion !== currentVersion) {
      //   // Apply migrations based on version differences
      // }
      
      // Remove version info from rehydrated state
      const { _persistVersion, ...stateWithoutVersion } = outboundState as any;
      return stateWithoutVersion;
    }
    return outboundState;
  },
  { whitelist: ['game'] }
);

/**
 * Transform to ensure entity registry maps are properly handled
 */
export const entityRegistryTransform = createTransform(
  // On state serialization (before saving)
  (inboundState, key) => {
    if (key === 'game') {
      // No special handling needed - we've already made the structure serializable
      return inboundState;
    }
    return inboundState;
  },
  
  // On state rehydration (after loading)
  (outboundState, key) => {
    if (key === 'game') {
      const state = outboundState as any;
      
      // Convert the entityRegistry back if needed
      // We're already using a serializable structure,
      // but this is where we would do any special 
      // reconstruction if needed
      
      return state;
    }
    return outboundState;
  },
  { whitelist: ['game'] }
);