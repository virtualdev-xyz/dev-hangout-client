export interface SpriteConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  imageUrl: string;
}

export class Sprite {
  private image: HTMLImageElement;
  private loaded: boolean = false;

  constructor(
    private config: SpriteConfig,
    private context: CanvasRenderingContext2D
  ) {
    this.image = new Image();
    this.image.src = config.imageUrl;
    this.image.onload = () => (this.loaded = true);
  }

  draw(x: number = this.config.x, y: number = this.config.y): void {
    if (!this.loaded) return;

    this.context.drawImage(this.image, x, y, this.config.width, this.config.height);
  }
}
