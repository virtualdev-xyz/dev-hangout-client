import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Character, InteractableEntity, Position } from '../types';
import { EntityType } from '../../systems/entities/EntityRegistry';

// Basic selectors
export const selectGameState = (state: RootState) => state.game;
export const selectCharacters = (state: RootState) => state.game.characters.entities;
export const selectInteractables = (state: RootState) => state.game.interactables.entities;
export const selectPlayer = (state: RootState) => state.game.player;

// Derived selectors
export const selectActiveCharacters = createSelector(
  selectCharacters,
  (characters): Character[] => 
    Object.values(characters).filter(char => char.state !== 'inactive')
);

export const selectNearbyEntities = createSelector(
  [selectCharacters, selectInteractables, selectPlayer],
  (characters, interactables, player): (Character | InteractableEntity)[] => {
    if (!player.characterId) return [];
    
    const playerChar = characters[player.characterId];
    if (!playerChar) return [];

    const NEARBY_RADIUS = 100; // Configurable radius
    
    const isNearby = (pos: Position) => {
      const dx = pos.x - playerChar.position.x;
      const dy = pos.y - playerChar.position.y;
      return Math.sqrt(dx * dx + dy * dy) <= NEARBY_RADIUS;
    };

    return [
      ...Object.values(characters)
        .filter(char => char.id !== player.characterId && isNearby(char.position)),
      ...Object.values(interactables)
        .filter(obj => isNearby(obj.position))
    ];
  }
);

export const selectEntityRelationships = createSelector(
  [selectGameState, (_: RootState, entityId: string) => entityId],
  (gameState, entityId) => {
    const registry = gameState.entityRegistry;
    return {
      owned: registry.getRelatedEntities(entityId, 'owns'),
      following: registry.getRelatedEntities(entityId, 'follows'),
      interactable: registry.getRelatedEntities(entityId, 'interacts')
    };
  }
);

export const selectEntitiesByType = createSelector(
  [selectGameState, (_: RootState, type: EntityType) => type],
  (gameState, type) => gameState.entityRegistry.getEntitiesByType(type)
);

export const selectInteractablesByDistance = createSelector(
  [selectInteractables, selectPlayer],
  (interactables, player): InteractableEntity[] => {
    if (!player.characterId) return [];

    return Object.values(interactables)
      .sort((a, b) => {
        const distA = getDistanceToPlayer(a.position, player);
        const distB = getDistanceToPlayer(b.position, player);
        return distA - distB;
      });
  }
);

export const selectPlayerInventory = createSelector(
  [selectGameState, selectPlayer],
  (gameState, player) => {
    if (!player.characterId) return [];
    return gameState.entityRegistry.getRelatedEntities(player.characterId, 'owns');
  }
);

export const selectInteractionChain = createSelector(
  [selectGameState, (_: RootState, startId: string) => startId],
  (gameState, startId): string[] => {
    const chain: string[] = [startId];
    let currentId = startId;

    while (true) {
      const triggers = gameState.entityRegistry.getRelatedEntities(currentId, 'triggers');
      if (triggers.length === 0) break;
      
      currentId = triggers[0];
      if (chain.includes(currentId)) break; // Prevent infinite loops
      
      chain.push(currentId);
    }

    return chain;
  }
);

// Helper function for distance calculations
const getDistanceToPlayer = (position: Position, player: GameState['player']): number => {
  if (!player.characterId) return Infinity;
  
  const dx = position.x - player.position.x;
  const dy = position.y - player.position.y;
  return Math.sqrt(dx * dx + dy * dy);
}; 