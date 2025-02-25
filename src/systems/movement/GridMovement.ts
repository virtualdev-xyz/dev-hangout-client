import { CollisionMap } from '../collision/CollisionMap';

export interface GridPosition {
  x: number;
  y: number;
}

export interface MovementConfig {
  gridSize: number;
  movementDuration: number;  // Time to move one grid space in ms
  enableDiagonal: boolean;
  collisionMap?: CollisionMap;
}

export class GridMovement {
  private currentPosition: GridPosition;
  private targetPosition: GridPosition | null = null;
  private movementProgress: number = 0;
  private isMoving: boolean = false;
  private collisionMap: CollisionMap | null = null;

  constructor(
    private config: MovementConfig = {
      gridSize: 32,
      movementDuration: 200,
      enableDiagonal: false
    }
  ) {
    this.currentPosition = { x: 0, y: 0 };
    this.collisionMap = config.collisionMap || null;
  }

  setPosition(x: number, y: number): void {
    // Snap to grid
    this.currentPosition = {
      x: Math.round(x / this.config.gridSize) * this.config.gridSize,
      y: Math.round(y / this.config.gridSize) * this.config.gridSize
    };
    this.targetPosition = null;
    this.movementProgress = 0;
    this.isMoving = false;
  }

  setCollisionMap(map: CollisionMap): void {
    this.collisionMap = map;
  }

  private canMoveTo(target: GridPosition): boolean {
    if (!this.collisionMap) return true;

    return !this.collisionMap.isBlocked(target.x, target.y);
  }

  moveInDirection(dx: number, dy: number): boolean {
    if (this.isMoving) return false;

    // Handle diagonal movement
    if (!this.config.enableDiagonal && dx !== 0 && dy !== 0) {
      // Prioritize horizontal movement
      dy = 0;
    }

    // Normalize input to single grid space
    dx = Math.sign(dx);
    dy = Math.sign(dy);

    const newTarget = {
      x: this.currentPosition.x + (dx * this.config.gridSize),
      y: this.currentPosition.y + (dy * this.config.gridSize)
    };

    return this.moveTo(newTarget);
  }

  moveTo(target: GridPosition): boolean {
    if (this.isMoving) return false;

    // Snap target to grid
    const snappedTarget = {
      x: Math.round(target.x / this.config.gridSize) * this.config.gridSize,
      y: Math.round(target.y / this.config.gridSize) * this.config.gridSize
    };

    // Check collision
    if (!this.canMoveTo(snappedTarget)) {
      return false;
    }

    // Don't start movement if already at target
    if (snappedTarget.x === this.currentPosition.x && 
        snappedTarget.y === this.currentPosition.y) {
      return false;
    }

    this.targetPosition = snappedTarget;
    this.movementProgress = 0;
    this.isMoving = true;
    return true;
  }

  update(deltaTime: number): void {
    if (!this.isMoving || !this.targetPosition) return;

    this.movementProgress += deltaTime / this.config.movementDuration;

    if (this.movementProgress >= 1) {
      // Movement complete
      this.currentPosition = { ...this.targetPosition };
      this.targetPosition = null;
      this.movementProgress = 0;
      this.isMoving = false;
    }
  }

  getWorldPosition(): { x: number; y: number } {
    if (!this.isMoving || !this.targetPosition) {
      return { ...this.currentPosition };
    }

    // Interpolate between current and target positions
    const progress = this.getEasedProgress();
    return {
      x: this.currentPosition.x + (this.targetPosition.x - this.currentPosition.x) * progress,
      y: this.currentPosition.y + (this.targetPosition.y - this.currentPosition.y) * progress
    };
  }

  private getEasedProgress(): number {
    // Smooth step easing for more natural movement
    const t = this.movementProgress;
    return t * t * (3 - 2 * t);
  }

  isMovementInProgress(): boolean {
    return this.isMoving;
  }

  getCurrentGridPosition(): GridPosition {
    return {
      x: Math.round(this.currentPosition.x / this.config.gridSize),
      y: Math.round(this.currentPosition.y / this.config.gridSize)
    };
  }
} 