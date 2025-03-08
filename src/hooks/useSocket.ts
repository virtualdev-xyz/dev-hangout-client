import { useEffect, useCallback } from 'react';
import { socketService } from '../network/socket/socketService';
import { ClientToServerEvents, ServerToClientEvents } from '../network/socket/types';

export function useSocket() {
  useEffect(() => {
    // Connect to socket when component mounts
    console.log('Connecting to socket...');
    socketService.connect();

    // Disconnect when component unmounts
    return () => {
      console.log('Disconnecting from socket...');
      socketService.disconnect();
    };
  }, []);

  const emit = useCallback(<T extends keyof ClientToServerEvents>(
    event: T,
    ...args: Parameters<ClientToServerEvents[T]>
  ) => {
    console.log('Emitting event:', event, 'with args:', args);
    socketService.getClient().emit(event, ...args);
  }, []);

  const on = useCallback(<T extends keyof ServerToClientEvents>(
    event: T,
    handler: ServerToClientEvents[T]
  ) => {
    console.log('Registering handler for event:', event);
    socketService.getClient().on(event, handler);
  }, []);

  const off = useCallback(<T extends keyof ServerToClientEvents>(
    event: T,
    handler: ServerToClientEvents[T]
  ) => {
    socketService.getClient().off(event, handler);
  }, []);

  return {
    emit,
    on,
    off,
  };
}

// Example usage:
/*
function MyComponent() {
  const { emit, on, off } = useSocket();

  useEffect(() => {
    // Listen for player joined events
    const handlePlayerJoined = (player) => {
      console.log('Player joined:', player);
    };

    on('player:joined', handlePlayerJoined);

    // Clean up listener when component unmounts
    return () => {
      off('player:joined', handlePlayerJoined);
    };
  }, [on, off]);

  const handleMove = () => {
    // Emit player movement
    emit('player:move', { x: 100, y: 100 });
  };

  return (
    <button onClick={handleMove}>
      Move Player
    </button>
  );
}
*/ 