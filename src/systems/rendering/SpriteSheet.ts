export interface SpriteFrame {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SpriteSheetConfig {
  imageUrl: string;
  frameWidth: number;
  frameHeight: number;
  animations: Record<string, SpriteFrame[]>;
}

export class SpriteSheet {
  private image: HTMLImageElement;
  private loaded: boolean = false;
  private currentFrame: number = 0;
  private frameTimer: number = 0;
  private readonly FRAME_DURATION = 100; // milliseconds per frame

  constructor(
    private config: SpriteSheetConfig,
    private context: CanvasRenderingContext2D
  ) {
    this.image = new Image();
    this.image.src = config.imageUrl;
    this.image.onload = () => this.loaded = true;
  }

  drawFrame(animationName: string, x: number, y: number): void {
    if (!this.loaded) return;
    
    const frames = this.config.animations[animationName];
    if (!frames) return;

    const frame = frames[this.currentFrame];
    
    this.context.drawImage(
      this.image,
      frame.x,
      frame.y,
      frame.width,
      frame.height,
      x,
      y,
      frame.width,
      frame.height
    );
  }

  update(deltaTime: number): void {
    this.frameTimer += deltaTime;
    if (this.frameTimer >= this.FRAME_DURATION) {
      this.frameTimer = 0;
      this.currentFrame = (this.currentFrame + 1) % 4; // Assuming 4 frames per animation
    }
  }
} 