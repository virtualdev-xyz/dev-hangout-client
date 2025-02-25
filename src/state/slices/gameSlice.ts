import { createSlice, createEntityAdapter, PayloadAction } from '@reduxjs/toolkit';
import { Character, InteractableEntity, GameState, Position } from '../types';
import { EntityRegistry } from '../../systems/entities/EntityRegistry';

const charactersAdapter = createEntityAdapter<Character>();
const interactablesAdapter = createEntityAdapter<InteractableEntity>();

const initialState: GameState = {
  characters: charactersAdapter.getInitialState(),
  interactables: interactablesAdapter.getInitialState(),
  player: {
    characterId: null,
    isInteracting: false,
    nearbyInteractableId: null
  },
  entityRegistry: new EntityRegistry()
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    addCharacter: (state, action: PayloadAction<Character>) => {
      charactersAdapter.addOne(state.characters, action.payload);
    },
    updateCharacterPosition: (state, action: PayloadAction<{
      id: string;
      position: Position;
    }>) => {
      charactersAdapter.updateOne(state.characters, {
        id: action.payload.id,
        changes: { position: action.payload.position }
      });
    },
    updateCharacterState: (state, action: PayloadAction<{
      id: string;
      state: CharacterState;
      direction: Direction;
    }>) => {
      charactersAdapter.updateOne(state.characters, {
        id: action.payload.id,
        changes: {
          state: action.payload.state,
          direction: action.payload.direction
        }
      });
    },
    addInteractable: (state, action: PayloadAction<InteractableEntity>) => {
      interactablesAdapter.addOne(state.interactables, action.payload);
    },
    setPlayerCharacter: (state, action: PayloadAction<string>) => {
      state.player.characterId = action.payload;
    },
    setNearbyInteractable: (state, action: PayloadAction<string | null>) => {
      state.player.nearbyInteractableId = action.payload;
    },
    setInteracting: (state, action: PayloadAction<boolean>) => {
      state.player.isInteracting = action.payload;
    },
    registerEntity: (state, action: PayloadAction<Entity>) => {
      state.entityRegistry.register(action.payload);
    },
    addEntityRelationship: (state, action: PayloadAction<{
      sourceId: string;
      targetId: string;
      type: RelationType;
      metadata?: Record<string, any>;
    }>) => {
      const { sourceId, targetId, type, metadata } = action.payload;
      state.entityRegistry.addRelationship(sourceId, targetId, type, metadata);
    }
  }
});

// Selectors
export const {
  selectAll: selectAllCharacters,
  selectById: selectCharacterById,
  selectIds: selectCharacterIds
} = charactersAdapter.getSelectors((state: RootState) => state.game.characters);

export const {
  selectAll: selectAllInteractables,
  selectById: selectInteractableById,
  selectIds: selectInteractableIds
} = interactablesAdapter.getSelectors((state: RootState) => state.game.interactables);

export const selectPlayerCharacter = (state: RootState) => {
  const { characterId } = state.game.player;
  return characterId ? selectCharacterById(state, characterId) : null;
};

export const selectNearbyInteractable = (state: RootState) => {
  const { nearbyInteractableId } = state.game.player;
  return nearbyInteractableId ? selectInteractableById(state, nearbyInteractableId) : null;
};

export const { 
  addCharacter,
  updateCharacterPosition,
  updateCharacterState,
  addInteractable,
  setPlayerCharacter,
  setNearbyInteractable,
  setInteracting,
  registerEntity,
  addEntityRelationship
} = gameSlice.actions;

export const gameReducer = gameSlice.reducer; 