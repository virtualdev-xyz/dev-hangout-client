import { Entity } from '../../systems/entities/EntityRegistry';
import { Position } from '../../state/types';
import { editor } from 'monaco-editor';

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

export interface EditorChange {
  roomId: string;
  changes: editor.IModelContentChange[];
  version: number;
  timestamp: number;
}

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  content?: string;
  icon?: string;
  extension?: string;
}

export interface DrawingPoint {
  x: number;
  y: number;
  pressure?: number;
}

export type ShapeType = 'rectangle' | 'circle' | 'line' | 'diamond' | 'database' | 'cloud' | 'server' | 'arrow';

export type DiagramTemplateType = 'flowchart' | 'sequence' | 'architecture' | 'erd' | 'usecase';

export interface DiagramTemplate {
  id: string;
  type: DiagramTemplateType;
  name: string;
  shapes: Shape[];
  connections: Connection[];
}

export interface Connection {
  id: string;
  fromShapeId: string;
  toShapeId: string;
  type: 'solid' | 'dashed' | 'dotted';
  arrowStart?: boolean;
  arrowEnd?: boolean;
  label?: string;
  color: string;
  width: number;
  layerId: string;
}

export interface Shape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  strokeWidth: number;
  fill?: string;
  layerId: string;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  textAlign?: 'left' | 'center' | 'right';
  textBaseline?: 'top' | 'middle' | 'bottom';
}

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  order: number;
}

export interface DrawingPath {
  id: string;
  userId: string;
  color: string;
  points: DrawingPoint[];
  tool: 'pen' | 'eraser' | 'shape';
  width: number;
  layerId: string;
  shape?: Shape;
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

  // Editor events
  'editor:change': (change: EditorChange) => void;
  'editor:sync': (content: string) => void;
  'editor:cursor': (data: { userId: string; position: Position }) => void;

  // File system events
  'files:list': (files: FileNode[]) => void;
  'files:updated': (file: FileNode) => void;
  'files:created': (file: FileNode) => void;
  'files:deleted': (fileId: string) => void;

  // Whiteboard events
  'whiteboard:path': (path: DrawingPath) => void;
  'whiteboard:sync': (data: { paths: DrawingPath[]; layers: Layer[]; templates: DiagramTemplate[] }) => void;
  'whiteboard:clear': () => void;
  'whiteboard:layer:add': (layer: Layer) => void;
  'whiteboard:layer:update': (layer: Layer) => void;
  'whiteboard:layer:delete': (layerId: string) => void;
  'whiteboard:shape:update': (shape: Shape) => void;
  'whiteboard:shape:delete': (shapeId: string) => void;
  'whiteboard:template:add': (template: DiagramTemplate) => void;
  'whiteboard:template:apply': (data: { shapes: Shape[]; connections: Connection[] }) => void;

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

  // Editor events
  'editor:change': (change: EditorChange) => void;
  'editor:cursor': (data: { roomId: string; position: Position }) => void;
  'editor:join': (roomId: string) => void;
  'editor:leave': (roomId: string) => void;

  // File system events
  'files:list': (options: { path: string }) => void;
  'files:update': (file: Partial<FileNode>) => void;
  'files:create': (file: Omit<FileNode, 'id'>) => void;
  'files:delete': (fileId: string) => void;

  // Whiteboard events
  'whiteboard:join': (roomId: string) => void;
  'whiteboard:leave': (roomId: string) => void;
  'whiteboard:path': (data: { roomId: string; path: DrawingPath }) => void;
  'whiteboard:clear': (roomId: string) => void;
  'whiteboard:layer:add': (data: { roomId: string; layer: Layer }) => void;
  'whiteboard:layer:update': (data: { roomId: string; layer: Layer }) => void;
  'whiteboard:layer:delete': (data: { roomId: string; layerId: string }) => void;
  'whiteboard:shape:update': (data: { roomId: string; shape: Shape }) => void;
  'whiteboard:shape:delete': (data: { roomId: string; shapeId: string }) => void;
  'whiteboard:template:add': (data: { roomId: string; template: DiagramTemplate }) => void;
  'whiteboard:template:apply': (data: { roomId: string; templateId: string; position: { x: number; y: number } }) => void;
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