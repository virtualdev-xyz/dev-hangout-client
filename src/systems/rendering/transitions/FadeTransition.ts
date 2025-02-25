import { Transition, TransitionConfig } from './Transition';

export class FadeTransition extends Transition {
  constructor(config: TransitionConfig & { color?: string }) {
    super(config);
  }

  render(ctx: CanvasRenderingContext2D): void {
    const alpha = this.getEasedProgress();
    ctx.save();
    ctx.fillStyle = 'black';
    ctx.globalAlpha = alpha;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
  }
} 