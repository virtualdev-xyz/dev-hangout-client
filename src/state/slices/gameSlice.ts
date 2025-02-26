import { createSlice, createEntityAdapter, PayloadAction } from '@reduxjs/toolkit';
import { Character, InteractableEntity, GameState, Position } from '../types';
import { RootState } from '../store';
import { Direction, CharacterState } from '../../systems/rendering/sprites/CharacterSprite';
import { Entity, EntityType } from '../../systems/entities/EntityRegistry';
import { RelationType } from '../../systems/entities/EntityRelationship';

const charactersAdapter = createEntityAdapter<Character>();
const interactablesAdapter = createEntityAdapter<InteractableEntity>();

const initialState: GameState = {
  characters: charactersAdapter.getInitialState(),
  interactables: interactablesAdapter.getInitialState(),
  player: {
    characterId: null,
    isInteracting: false,
    nearbyInteractableId: null,
    position: { x: 0, y: 0 },
  },
  entityRegistry: {
    entities: new Map(),
    relationships: new Map(),
  },
};

export const gameSlice = createSlice({
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
    setPlayerCharacter: (state, action: PayloadAction<string>) => {
      state.player.characterId = action.payload;
    },
    setPlayerPosition: (state, action: PayloadAction<Position>) => {
      state.player.position = action.payload;
    },
    setNearbyInteractable: (state, action: PayloadAction<string | null>) => {
      state.player.nearbyInteractableId = action.payload;
    },
    setInteracting: (state, action: PayloadAction<boolean>) => {
      state.player.isInteracting = action.payload;
    },

    // Entity Registry actions
    registerEntity: (state, action: PayloadAction<Entity>) => {
      state.entityRegistry.entities.set(action.payload.id, action.payload);
    },
    unregisterEntity: (state, action: PayloadAction<string>) => {
      state.entityRegistry.entities.delete(action.payload);
      state.entityRegistry.relationships.delete(action.payload);
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
      if (!state.entityRegistry.relationships.has(sourceId)) {
        state.entityRegistry.relationships.set(sourceId, []);
      }
      state.entityRegistry.relationships.get(sourceId)!.push({
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
  registerEntity,
  unregisterEntity,
  addEntityRelationship,
} = gameSlice.actions;

export const gameReducer = gameSlice.reducer;
