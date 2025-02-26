export interface CameraConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  zoom: number;
}

export class Camera {
  private x: number;
  private y: number;
  private width: number;
  private height: number;
  private zoom: number;
  private target: { x: number; y: number } | null = null;
  private readonly SMOOTH_FACTOR = 0.1;

  constructor(config: CameraConfig) {
    this.x = config.x;
    this.y = config.y;
    this.width = config.width;
    this.height = config.height;
    this.zoom = config.zoom;
  }

  update(deltaTime: number): void {
    if (this.target) {
      // Smooth camera follow
      this.x += (this.target.x - this.width / 2 - this.x) * this.SMOOTH_FACTOR;
      this.y += (this.target.y - this.height / 2 - this.y) * this.SMOOTH_FACTOR;
    }
  }

  follow(target: { x: number; y: number }): void {
    this.target = target;
  }

  stopFollowing(): void {
    this.target = null;
  }

  setZoom(zoom: number): void {
    this.zoom = Math.max(0.1, zoom);
  }

  worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
    return {
      x: (worldX - this.x) * this.zoom,
      y: (worldY - this.y) * this.zoom,
    };
  }

  screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
    return {
      x: screenX / this.zoom + this.x,
      y: screenY / this.zoom + this.y,
    };
  }

  applyToContext(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-this.x, -this.y);
  }

  restore(ctx: CanvasRenderingContext2D): void {
    ctx.restore();
  }
}
