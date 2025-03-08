import { Entity } from '../../systems/entities/EntityRegistry';
import { Position } from '../../state/types';

// Message types for serialization
export type MessageType = 
  | 'PLAYER_MOVE'
  | 'PLAYER_UPDATE'
  | 'ENTITY_CREATE'
  | 'ENTITY_UPDATE'
  | 'ENTITY_DELETE'
  | 'SYNC_REQUEST'
  | 'SYNC_RESPONSE';

export interface Message<T = any> {
  type: MessageType;
  payload: T;
  timestamp: number;
  sequence?: number;
}

export interface PlayerMoveMessage {
  playerId: string;
  position: Position;
  predictedPosition?: Position;
  timestamp: number;
  input?: {
    direction: 'up' | 'down' | 'left' | 'right';
    delta: number;
  };
}

export interface EntityUpdateMessage {
  entity: Entity;
  partial?: boolean;
  timestamp: number;
}

// Serialization helpers
export const serializeMessage = <T>(type: MessageType, payload: T, sequence?: number): string => {
  const message: Message<T> = {
    type,
    payload,
    timestamp: Date.now(),
    sequence,
  };
  return JSON.stringify(message);
};

export const deserializeMessage = <T>(data: string): Message<T> => {
  try {
    const message = JSON.parse(data) as Message<T>;
    if (!message.type || !message.payload) {
      throw new Error('Invalid message format');
    }
    return message;
  } catch (error) {
    throw new Error(`Failed to deserialize message: ${error}`);
  }
};

// Message compression for frequent updates
export const compressPosition = (position: Position): number => {
  // Convert position to a more compact format
  // For example, combine x and y into a single integer if precision allows
  return (Math.round(position.x) << 16) | (Math.round(position.y) & 0xFFFF);
};

export const decompressPosition = (compressed: number): Position => {
  return {
    x: compressed >> 16,
    y: compressed & 0xFFFF,
  };
};

// Delta compression for entity updates
export const createDelta = (current: Entity, previous: Entity): Partial<Entity> => {
  const delta: Partial<Entity> = {};
  
  if (current.type !== previous.type) delta.type = current.type;
  
  // Compare data fields and only include changed ones
  const currentData = current.data || {};
  const previousData = previous.data || {};
  const changedData: Record<string, any> = {};
  let hasDataChanges = false;
  
  Object.keys(currentData).forEach(key => {
    if (JSON.stringify(currentData[key]) !== JSON.stringify(previousData[key])) {
      changedData[key] = currentData[key];
      hasDataChanges = true;
    }
  });
  
  if (hasDataChanges) {
    delta.data = changedData;
  }
  
  return delta;
};

export const applyDelta = (base: Entity, delta: Partial<Entity>): Entity => {
  return {
    ...base,
    ...delta,
    data: delta.data ? { ...base.data, ...delta.data } : base.data,
  };
};

// Message batching for efficient network usage
export class MessageBatcher {
  private static readonly MAX_BATCH_SIZE = 100;
  private static readonly MAX_BATCH_DELAY = 50; // ms
  
  private batch: Message[] = [];
  private timer: NodeJS.Timeout | null = null;
  private callback: (messages: Message[]) => void;
  
  constructor(callback: (messages: Message[]) => void) {
    this.callback = callback;
  }
  
  public add(message: Message): void {
    this.batch.push(message);
    
    if (this.batch.length >= MessageBatcher.MAX_BATCH_SIZE) {
      this.flush();
    } else if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), MessageBatcher.MAX_BATCH_DELAY);
    }
  }
  
  public flush(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    
    if (this.batch.length > 0) {
      this.callback(this.batch);
      this.batch = [];
    }
  }
  
  public clear(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.batch = [];
  }
} 