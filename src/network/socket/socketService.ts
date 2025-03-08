import { SocketClient } from './SocketClient';
import { SocketOptions } from './types';

class SocketService {
  private static instance: SocketService;
  private client: SocketClient | null = null;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public initialize(options: SocketOptions): void {
    if (this.client) {
      console.warn('Socket client already initialized');
      return;
    }

    this.client = new SocketClient(options);
  }

  public connect(): void {
    if (!this.client) {
      throw new Error('Socket client not initialized');
    }
    this.client.connect();
  }

  public disconnect(): void {
    if (!this.client) {
      throw new Error('Socket client not initialized');
    }
    this.client.disconnect();
  }

  public getClient(): SocketClient {
    if (!this.client) {
      throw new Error('Socket client not initialized');
    }
    return this.client;
  }
}

export const socketService = SocketService.getInstance();

// Initialize socket service with default options
socketService.initialize({
  url: process.env.VITE_SOCKET_URL || 'http://localhost:3000',
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 10000,
}); 