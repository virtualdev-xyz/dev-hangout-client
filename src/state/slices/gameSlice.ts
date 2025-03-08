import { createSlice, createEntityAdapter, PayloadAction } from '@reduxjs/toolkit';
import { Character, InteractableEntity, GameState, Position, SerializedEntityRegistry, Entity } from '../types';
import { RootState } from '../store';
import { Direction, CharacterState } from '../../systems/rendering/sprites/CharacterSprite';
import { EntityType } from '../../systems/entities/EntityRegistry';
import { RelationType, Relationship } from '../../systems/entities/EntityRelationship';

const charactersAdapter = createEntityAdapter<Character>();
const interactablesAdapter = createEntityAdapter<InteractableEntity>();

// Serializable initial state
const initialState: GameState = {
  characters: {
    ids: [],
    entities: {},
  },
  interactables: {
    ids: [],
    entities: {},
  },
  player: {
    characterId: null,
    isInteracting: false,
    nearbyInteractableId: null,
    position: { x: 0, y: 0 },
  },
  entityRegistry: {
    entities: {},
    relationships: {},
  },
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    // Character actions
    addCharacter: (state, action: PayloadAction<Character>) => {
      charactersAdapter.addOne(state.characters, action.payload);
    },
    updateCharacterPosition: (
      state,
      action: PayloadAction<{
        id: string;
        position: Position;
      }>
    ) => {
      charactersAdapter.updateOne(state.characters, {
        id: action.payload.id,
        changes: { position: action.payload.position },
      });
    },
    updateCharacterState: (
      state,
      action: PayloadAction<{
        id: string;
        state: CharacterState;
        direction: Direction;
      }>
    ) => {
      charactersAdapter.updateOne(state.characters, {
        id: action.payload.id,
        changes: {
          state: action.payload.state,
          direction: action.payload.direction,
        },
      });
    },

    // Interactable actions
    addInteractable: (state, action: PayloadAction<InteractableEntity>) => {
      interactablesAdapter.addOne(state.interactables, action.payload);
    },
    removeInteractable: (state, action: PayloadAction<string>) => {
      interactablesAdapter.removeOne(state.interactables, action.payload);
    },

    // Player actions
    setPlayerCharacter: (state, action: PayloadAction<string | null>) => {
      state.player.characterId = action.payload;
    },
    setPlayerPosition: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.player.position = action.payload;
    },
    setNearbyInteractable: (state, action: PayloadAction<string | null>) => {
      state.player.nearbyInteractableId = action.payload;
    },
    setInteracting: (state, action: PayloadAction<boolean>) => {
      state.player.isInteracting = action.payload;
    },

    // Entity Registry actions
    addEntity: (state, action: PayloadAction<Entity>) => {
      const entity = action.payload;
      state.entityRegistry.entities[entity.id] = {
        id: entity.id,
        type: entity.type as EntityType,
        data: entity.data,
      };
    },
    updateEntity: (state, action: PayloadAction<Entity>) => {
      const entity = action.payload;
      if (state.entityRegistry.entities[entity.id]) {
        state.entityRegistry.entities[entity.id] = {
          ...state.entityRegistry.entities[entity.id],
          type: entity.type as EntityType,
          data: entity.data,
        };
      }
    },
    removeEntity: (state, action: PayloadAction<string>) => {
      const entityId = action.payload;
      delete state.entityRegistry.entities[entityId];
      // Remove any relationships involving this entity
      Object.entries(state.entityRegistry.relationships).forEach(([key, relationships]) => {
        state.entityRegistry.relationships[key] = relationships.filter(
          (rel: Relationship) => rel.sourceId !== entityId && rel.targetId !== entityId
        );
      });
    },
    addEntityRelationship: (
      state,
      action: PayloadAction<{
        sourceId: string;
        targetId: string;
        type: RelationType;
        metadata?: Record<string, any>;
      }>
    ) => {
      const { sourceId, targetId, type, metadata } = action.payload;
      if (!state.entityRegistry.relationships[sourceId]) {
        state.entityRegistry.relationships[sourceId] = [];
      }
      state.entityRegistry.relationships[sourceId].push({
        sourceId,
        targetId,
        type,
        metadata,
      });
    },
  },
});

// Selectors
export const {
  selectAll: selectAllCharacters,
  selectById: selectCharacterById,
  selectIds: selectCharacterIds,
} = charactersAdapter.getSelectors<RootState>(state => state.game.characters);

export const {
  selectAll: selectAllInteractables,
  selectById: selectInteractableById,
  selectIds: selectInteractableIds,
} = interactablesAdapter.getSelectors<RootState>(state => state.game.interactables);

// Action creators
export const {
  addCharacter,
  updateCharacterPosition,
  updateCharacterState,
  addInteractable,
  removeInteractable,
  setPlayerCharacter,
  setPlayerPosition,
  setNearbyInteractable,
  setInteracting,
  addEntity,
  updateEntity,
  removeEntity,
  addEntityRelationship,
} = gameSlice.actions;

export default gameSlice.reducer;
