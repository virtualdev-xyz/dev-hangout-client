import { createTransform } from 'redux-persist';
import { RootState } from '../store';

interface Entity {
  id: string;
  type: string;
  data: Record<string, any>;
}

interface GameState {
  entityRegistry?: {
    entities: Record<string, Entity>;
    relationships: Set<string>;
  };
  [key: string]: any;
}

interface SerializedGameState {
  entityRegistry: {
    entities: Record<string, Entity>;
    relationships: string[];
  };
  [key: string]: any;
}

/**
 * Transform to handle migrations between different versions of the state structure
 */
export const migrationTransform = createTransform(
  // transform state on its way to being serialized and persisted
  (inboundState: GameState, key) => {
    // Add version info to the state
    return {
      ...inboundState,
      _version: 1,
    };
  },
  
  // transform state being rehydrated
  (outboundState: GameState & { _version?: number }, key) => {
    const currentVersion = 1;
    const stateVersion = outboundState._version || 0;

    // Handle migrations based on version differences
    if (stateVersion < currentVersion) {
      // Perform any necessary migrations here
      // For now, we just ensure the state structure is correct
      return {
        ...outboundState,
        _version: currentVersion,
      };
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
  (inboundState: GameState, key): SerializedGameState => {
    if (key === 'game' && inboundState.entityRegistry) {
      // Serialize entity relationships and data
      return {
        ...inboundState,
        entityRegistry: {
          entities: Object.fromEntries(
            Object.entries(inboundState.entityRegistry.entities || {}).map(([id, entity]) => [
              id,
              {
                ...entity,
                // Convert any special types or class instances to plain objects
                data: JSON.parse(JSON.stringify(entity.data || {})),
              },
            ])
          ),
          relationships: Array.from(inboundState.entityRegistry.relationships || []),
        },
      };
    }
    // Return a default serialized state if entityRegistry is undefined
    return {
      ...inboundState,
      entityRegistry: {
        entities: {},
        relationships: [],
      },
    };
  },
  
  // On state rehydration (after loading)
  (outboundState: SerializedGameState, key): GameState => {
    if (key === 'game') {
      // Reconstruct entity relationships and data
      return {
        ...outboundState,
        entityRegistry: {
          entities: outboundState.entityRegistry.entities,
          // Convert relationship array back to Set if needed
          relationships: new Set(outboundState.entityRegistry.relationships),
        },
      };
    }
    return {
      ...outboundState,
      entityRegistry: {
        entities: {},
        relationships: new Set(),
      },
    };
  },
  { whitelist: ['game'] }
);