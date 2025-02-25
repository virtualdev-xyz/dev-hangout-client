import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const networkMiddleware: Middleware<{}, RootState> = store => next => action => {
  // Handle network synchronization here
  const result = next(action);

  if (action.type.startsWith('game/update')) {
    // Broadcast state changes to other clients
    // This is where you'd integrate with your networking solution
  }

  return result;
}; 