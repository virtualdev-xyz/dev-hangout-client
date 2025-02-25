import { Direction, CharacterState } from '../systems/rendering/sprites/CharacterSprite';
import { Entity } from '../systems/entities/EntityRegistry';
import { Relationship } from '../systems/entities/EntityRelationship';

export interface Position {
  x: number;
  y: number;
}

export interface Character {
  id: string;
  name: string;
  position: Position;
  direction: Direction;
  state: CharacterState;
  appearance: {
    spritesheet: string;
    colors: {
      skin: string;
      hair: string;
      shirt: string;
      pants: string;
      shoes: string;
    }
  }
}

export interface InteractableEntity {
  id: string;
  type: 'npc' | 'object';
  position: Position;
  dimensions: {
    width: number;
    height: number;
  };
  interactionRadius: number;
  prompt: string;
  data: Record<string, any>;
}

export interface GameState {
  characters: {
    ids: string[];
    entities: Record<string, Character>;
  };
  interactables: {
    ids: string[];
    entities: Record<string, InteractableEntity>;
  };
  player: {
    characterId: string | null;
    isInteracting: boolean;
    nearbyInteractableId: string | null;
    position: Position;
  };
  entityRegistry: {
    entities: Map<string, Entity>;
    relationships: Map<string, Relationship[]>;
  };
} 