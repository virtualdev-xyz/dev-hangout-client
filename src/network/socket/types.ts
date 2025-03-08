import { Entity } from '../../systems/entities/EntityRegistry';
import { Position } from '../../state/types';

export interface PlayerState {
  id: string;
  position: Position;
  direction: 'up' | 'down' | 'left' | 'right';
  isMoving: boolean;
  appearance: {
    sprite: string;
    name: string;
    color: string;
  };
}

export interface ServerToClientEvents {
  // Connection events
  'connect': () => void;
  'disconnect': () => void;
  'reconnect': (attemptNumber: number) => void;
  'reconnect_error': (error: Error) => void;
  'reconnect_failed': () => void;

  // Game state events
  'player:joined': (player: PlayerState) => void;
  'player:left': (playerId: string) => void;
  'player:moved': (playerId: string, position: Position) => void;
  'player:updated': (player: PlayerState) => void;
  'players:sync': (players: PlayerState[]) => void;

  // Entity events
  'entity:created': (entity: Entity) => void;
  'entity:updated': (entity: Entity) => void;
  'entity:deleted': (entityId: string) => void;
  'entities:sync': (entities: Entity[]) => void;

  // Error events
  'error': (error: { code: string; message: string }) => void;
}

export interface ClientToServerEvents {
  // Player events
  'player:move': (position: Position) => void;
  'player:update': (state: Partial<PlayerState>) => void;

  // Entity events
  'entity:create': (entity: Omit<Entity, 'id'>) => void;
  'entity:update': (entityId: string, updates: Partial<Entity>) => void;
  'entity:delete': (entityId: string) => void;

  // Room events
  'room:join': (roomId: string) => void;
  'room:leave': (roomId: string) => void;
}

export interface SocketOptions {
  url: string;
  autoConnect?: boolean;
  reconnection?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
  reconnectionDelayMax?: number;
  timeout?: number;
  auth?: {
    token?: string;
  };
} 