import { useCallback } from 'react';
import { persistor } from '../state/store';

/**
 * Hook to provide persistence-related functionality
 */
export function usePersistence() {
  /**
   * Purge all persisted state (useful for logout or resetting app state)
   */
  const purgeState = useCallback(async () => {
    await persistor.purge();
  }, []);

  /**
   * Pause state persistence (useful during sensitive operations)
   */
  const pausePersistence = useCallback(() => {
    persistor.pause();
  }, []);

  /**
   * Resume state persistence after pausing
   */
  const resumePersistence = useCallback(() => {
    persistor.persist();
  }, []);

  /**
   * Flush state to storage immediately
   * This ensures the current state is persisted right away
   */
  const flushState = useCallback(async () => {
    await persistor.flush();
  }, []);

  return {
    purgeState,
    pausePersistence,
    resumePersistence,
    flushState
  };
}