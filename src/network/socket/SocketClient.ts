import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents, SocketOptions } from './types';
import { store } from '../../state/store';
import { addEntity, removeEntity, updateEntity } from '../../state/slices/gameSlice';

type EventHandler<T extends keyof ServerToClientEvents> = ServerToClientEvents[T];
type EventHandlerMap = Map<keyof ServerToClientEvents, Set<(...args: any[]) => void>>;
type SocketEventName = keyof ServerToClientEvents;

export class SocketClient {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
  private options: SocketOptions;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private eventHandlers: EventHandlerMap = new Map();

  constructor(options: SocketOptions) {
    this.options = {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
      ...options,
    };
  }

  public connect(): void {
    if (this.socket?.connected) return;

    this.socket = io(this.options.url, {
      autoConnect: this.options.autoConnect,
      reconnection: this.options.reconnection,
      reconnectionAttempts: this.options.reconnectionAttempts,
      reconnectionDelay: this.options.reconnectionDelay,
      reconnectionDelayMax: this.options.reconnectionDelayMax,
      timeout: this.options.timeout,
      auth: this.options.auth,
    });

    this.setupEventHandlers();
  }

  public disconnect(): void {
    if (!this.socket) return;
    this.socket.disconnect();
    this.socket = null;
    this.clearReconnectTimeout();
  }

  public emit<T extends keyof ClientToServerEvents>(
    event: T,
    ...args: Parameters<ClientToServerEvents[T]>
  ): void {
    if (!this.socket?.connected) {
      console.warn(`Socket not connected. Unable to emit event: ${event}`);
      return;
    }
    this.socket.emit(event, ...args);
  }

  public on<T extends SocketEventName>(
    event: T,
    handler: EventHandler<T>
  ): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler as any);

    if (this.socket) {
      this.socket.on(event, handler as any);
    }
  }

  public off<T extends SocketEventName>(
    event: T,
    handler: EventHandler<T>
  ): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler as any);
      if (this.socket) {
        this.socket.off(event, handler as any);
      }
    }
  }

  private setupEventHandlers(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      if (this.options.reconnection) {
        this.attemptReconnect();
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`Socket reconnected after ${attemptNumber} attempts`);
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('Socket reconnection error:', error);
      this.attemptReconnect();
    });

    this.socket.on('reconnect_failed', () => {
      console.error('Socket reconnection failed');
    });

    // Entity events
    this.socket.on('entity:created', (entity) => {
      store.dispatch(addEntity(entity));
    });

    this.socket.on('entity:updated', (entity) => {
      store.dispatch(updateEntity(entity));
    });

    this.socket.on('entity:deleted', (entityId) => {
      store.dispatch(removeEntity(entityId));
    });

    // Error handling
    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Reattach any existing event handlers
    this.eventHandlers.forEach((handlers, event) => {
      handlers.forEach((handler) => {
        this.socket!.on(event, handler as any);
      });
    });
  }

  private attemptReconnect(): void {
    if (this.reconnectTimeout) return;

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      this.reconnectAttempts++;

      console.log(`Attempting reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      this.connect();
    }, this.reconnectDelay * Math.pow(2, this.reconnectAttempts));
  }

  private clearReconnectTimeout(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }
} 