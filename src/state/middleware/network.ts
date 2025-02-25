import { Middleware } from '@reduxjs/toolkit';

export const networkMiddleware: Middleware = () => next => action => {
  // Add network middleware logic here
  return next(action);
}; 