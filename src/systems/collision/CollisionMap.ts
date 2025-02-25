export type CollisionTile = 0 | 1;  // 0 = passable, 1 = blocked

export interface CollisionMapConfig {
  gridSize: number;
  width: number;   // Map width in tiles
  height: number;  // Map height in tiles
}

export class CollisionMap {
  private grid: CollisionTile[][];

  constructor(private config: CollisionMapConfig) {
    this.grid = Array(config.height).fill(0).map(() => 
      Array(config.width).fill(0)
    );
  }

  setTile(x: number, y: number, value: CollisionTile): void {
    if (this.isValidPosition(x, y)) {
      this.grid[y][x] = value;
    }
  }

  getTile(x: number, y: number): CollisionTile {
    if (this.isValidPosition(x, y)) {
      return this.grid[y][x];
    }
    return 1; // Treat out of bounds as blocked
  }

  isBlocked(worldX: number, worldY: number): boolean {
    const tileX = Math.floor(worldX / this.config.gridSize);
    const tileY = Math.floor(worldY / this.config.gridSize);
    return this.getTile(tileX, tileY) === 1;
  }

  private isValidPosition(x: number, y: number): boolean {
    return x >= 0 && x < this.config.width && 
           y >= 0 && y < this.config.height;
  }

  loadFromArray(data: CollisionTile[][]): void {
    if (data.length !== this.config.height || 
        data[0].length !== this.config.width) {
      throw new Error('Collision data dimensions do not match map size');
    }
    this.grid = data.map(row => [...row]);
  }

  // Debug visualization
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.globalAlpha = 0.3;

    for (let y = 0; y < this.config.height; y++) {
      for (let x = 0; x < this.config.width; x++) {
        if (this.grid[y][x] === 1) {
          ctx.fillStyle = '#FF0000';
          ctx.fillRect(
            x * this.config.gridSize,
            y * this.config.gridSize,
            this.config.gridSize,
            this.config.gridSize
          );
        }
      }
    }

    ctx.restore();
  }
} 