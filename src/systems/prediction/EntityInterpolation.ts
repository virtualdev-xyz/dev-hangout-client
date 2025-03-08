import { Entity } from '../../systems/entities/EntityRegistry';
import { Position } from '../../state/types';
import { store } from '../../state/store';
import { updateEntity } from '../../state/slices/gameSlice';

interface InterpolationState {
  entity: Entity;
  startPosition: Position;
  targetPosition: Position;
  startTime: number;
  endTime: number;
}

export class EntityInterpolation {
  private static readonly INTERPOLATION_DELAY = 100; // ms
  private static readonly MIN_UPDATE_DISTANCE = 0.1; // pixels
  private static readonly BUFFER_SIZE = 60; // frames

  private interpolationStates = new Map<string, InterpolationState>();
  private entityBuffer = new Map<string, { position: Position; timestamp: number }[]>();
  private lastUpdateTime = Date.now();
  private animationFrameId: number | null = null;

  constructor() {
    this.startInterpolation();
  }

  public addEntityUpdate(entityId: string, position: Position, timestamp: number): void {
    // Add update to buffer
    if (!this.entityBuffer.has(entityId)) {
      this.entityBuffer.set(entityId, []);
    }

    const buffer = this.entityBuffer.get(entityId)!;
    buffer.push({ position, timestamp });

    // Sort buffer by timestamp
    buffer.sort((a, b) => a.timestamp - b.timestamp);

    // Trim buffer if too large
    while (buffer.length > EntityInterpolation.BUFFER_SIZE) {
      buffer.shift();
    }
  }

  public updateEntityPosition(entity: Entity, position: Position): void {
    const currentTime = Date.now();
    const entityId = entity.id;

    // Get current entity position from state
    const currentEntity = store.getState().game.entityRegistry.entities[entityId];
    if (!currentEntity) return;

    const currentPosition = (currentEntity.data as any).position as Position;
    if (!currentPosition) return;

    // Calculate distance to new position
    const distance = this.calculateDistance(currentPosition, position);
    if (distance < EntityInterpolation.MIN_UPDATE_DISTANCE) return;

    // Create new interpolation state
    const interpolationState: InterpolationState = {
      entity,
      startPosition: currentPosition,
      targetPosition: position,
      startTime: currentTime,
      endTime: currentTime + EntityInterpolation.INTERPOLATION_DELAY,
    };

    this.interpolationStates.set(entityId, interpolationState);
  }

  private startInterpolation(): void {
    const interpolate = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - this.lastUpdateTime;
      this.lastUpdateTime = currentTime;

      // Process buffered updates
      this.entityBuffer.forEach((buffer, entityId) => {
        // Remove old updates
        while (buffer.length > 2 && buffer[1].timestamp < currentTime - EntityInterpolation.INTERPOLATION_DELAY) {
          buffer.shift();
        }

        // If we have at least 2 positions, interpolate between them
        if (buffer.length >= 2) {
          const [pos1, pos2] = buffer;
          const entity = store.getState().game.entityRegistry.entities[entityId];
          if (entity) {
            this.updateEntityPosition(entity, this.interpolatePosition(pos1.position, pos2.position, pos1.timestamp, pos2.timestamp, currentTime));
          }
        }
      });

      // Update interpolating entities
      this.interpolationStates.forEach((state, entityId) => {
        const progress = (currentTime - state.startTime) / (state.endTime - state.startTime);

        if (progress >= 1) {
          // Interpolation complete
          this.interpolationStates.delete(entityId);
          store.dispatch(updateEntity({
            ...state.entity,
            data: {
              ...state.entity.data,
              position: state.targetPosition,
            },
          }));
        } else {
          // Interpolate position
          const interpolatedPosition = {
            x: state.startPosition.x + (state.targetPosition.x - state.startPosition.x) * progress,
            y: state.startPosition.y + (state.targetPosition.y - state.startPosition.y) * progress,
          };

          store.dispatch(updateEntity({
            ...state.entity,
            data: {
              ...state.entity.data,
              position: interpolatedPosition,
            },
          }));
        }
      });

      this.animationFrameId = requestAnimationFrame(interpolate);
    };

    this.animationFrameId = requestAnimationFrame(interpolate);
  }

  public stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private calculateDistance(pos1: Position, pos2: Position): number {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private interpolatePosition(
    pos1: Position,
    pos2: Position,
    time1: number,
    time2: number,
    currentTime: number
  ): Position {
    const progress = (currentTime - time1) / (time2 - time1);
    return {
      x: pos1.x + (pos2.x - pos1.x) * progress,
      y: pos1.y + (pos2.y - pos1.y) * progress,
    };
  }
} 