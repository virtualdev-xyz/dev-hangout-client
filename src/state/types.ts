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
    };
  };
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

// Serializable version of the entity registry for persistence
export interface SerializedEntityRegistry {
  entities: Record<string, Entity>;
  relationships: Record<string, Relationship[]>;
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
  entityRegistry: SerializedEntityRegistry;
}

export interface Entity {
  id: string;
  type: string;
  data: Record<string, any>;
  position?: {
    x: number;
    y: number;
  };
  metadata?: {
    createdAt: number;
    updatedAt: number;
    createdBy: string;
    updatedBy: string;
  };
}

export interface EntityRelationship {
  sourceId: string;
  targetId: string;
  type: string;
  metadata?: Record<string, any>;
}

export interface EntityRegistry {
  entities: Record<string, Entity>;
  relationships: Set<string>;
}
