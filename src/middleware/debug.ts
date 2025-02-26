import { Middleware, Action, AnyAction } from '@reduxjs/toolkit';
import React from 'react';

interface DebugConfig {
  enableLogging: boolean;
  enableTiming: boolean;
  logLevel: 'info' | 'debug' | 'warn' | 'error';
}

const defaultConfig: DebugConfig = {
  enableLogging: import.meta.env.DEV,
  enableTiming: import.meta.env.DEV,
  logLevel: 'info',
};

export const createDebugMiddleware = (
  config: Partial<DebugConfig> = {}
): Middleware<{}, any, any> => {
  const finalConfig = { ...defaultConfig, ...config };

  return store => next => (action: AnyAction) => {
    if (!finalConfig.enableLogging) {
      return next(action);
    }

    const startTime = performance.now();
    console.group(`Action: ${action.type}`);
    console.log('Previous State:', store.getState());
    console.log('Action:', action);

    const result = next(action);

    console.log('Next State:', store.getState());

    if (finalConfig.enableTiming) {
      const endTime = performance.now();
      console.log(`Time taken: ${(endTime - startTime).toFixed(2)}ms`);
    }

    console.groupEnd();
    return result;
  };
};

// Debug component HOC for logging renders
export const withDebugLogging = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string = WrappedComponent.displayName || WrappedComponent.name
) => {
  return function DebugComponent(props: P) {
    console.log(`[${componentName}] Rendering with props:`, props);
    return React.createElement(WrappedComponent, props);
  };
};

// Performance monitoring utility
export const measurePerformance = async <T>(
  operation: () => Promise<T> | T,
  operationName: string
): Promise<T> => {
  const startTime = performance.now();
  try {
    const result = await operation();
    const endTime = performance.now();
    console.log(`[Performance] ${operationName}: ${(endTime - startTime).toFixed(2)}ms`);
    return result;
  } catch (error) {
    const endTime = performance.now();
    console.error(
      `[Performance] ${operationName} failed after ${(endTime - startTime).toFixed(2)}ms:`,
      error
    );
    throw error;
  }
};
