import { Transition, TransitionConfig } from './Transition';

export class PixelateTransition extends Transition {
  private tempCanvas: HTMLCanvasElement;
  private tempCtx: CanvasRenderingContext2D;

  constructor(config: TransitionConfig) {
    super(config);
    this.tempCanvas = document.createElement('canvas');
    this.tempCtx = this.tempCanvas.getContext('2d')!;
  }

  render(ctx: CanvasRenderingContext2D): void {
    const progress = this.getEasedProgress();
    const pixelSize = Math.max(1, Math.ceil(32 * progress));
    
    this.tempCanvas.width = ctx.canvas.width;
    this.tempCanvas.height = ctx.canvas.height;
    
    // Draw current scene to temp canvas
    this.tempCtx.drawImage(ctx.canvas, 0, 0);
    
    // Clear main canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw pixelated version
    for (let y = 0; y < ctx.canvas.height; y += pixelSize) {
      for (let x = 0; x < ctx.canvas.width; x += pixelSize) {
        const pixelData = this.tempCtx.getImageData(x, y, 1, 1).data;
        ctx.fillStyle = `rgb(${pixelData[0]},${pixelData[1]},${pixelData[2]})`;
        ctx.fillRect(x, y, pixelSize, pixelSize);
      }
    }
  }
} 