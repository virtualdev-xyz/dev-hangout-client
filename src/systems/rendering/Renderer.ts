import { Camera } from './Camera';
import { Transition } from './transitions/Transition';
import { FadeTransition } from './transitions/FadeTransition';
import { PixelateTransition } from './transitions/PixelateTransition';

export class Renderer {
  private lastTime: number = 0;
  private accumulator: number = 0;
  private readonly FIXED_TIMESTEP: number = 1000 / 60;
  private camera: Camera;
  private currentTransition: Transition | null = null;

  constructor(private context: CanvasRenderingContext2D) {
    this.camera = new Camera({
      x: 0,
      y: 0,
      width: context.canvas.width,
      height: context.canvas.height,
      zoom: 1,
    });
  }

  public start(): void {
    this.lastTime = performance.now();
    this.loop();
  }

  private loop(): void {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    this.accumulator += deltaTime;

    while (this.accumulator >= this.FIXED_TIMESTEP) {
      this.update(this.FIXED_TIMESTEP);
      this.accumulator -= this.FIXED_TIMESTEP;
    }

    const alpha = this.accumulator / this.FIXED_TIMESTEP;
    this.render(alpha);

    requestAnimationFrame(() => this.loop());
  }

  private update(timestep: number): void {
    this.camera.update(timestep);
  }

  private render(interpolation: number): void {
    const ctx = this.context;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    this.camera.applyToContext(ctx);
    // Render game objects here
    this.camera.restore(ctx);

    // Apply transition effect if active
    if (this.currentTransition) {
      this.currentTransition.render(ctx);
    }
  }

  public getCamera(): Camera {
    return this.camera;
  }

  public async transition(type: 'fade' | 'pixelate', duration: number = 500): Promise<void> {
    return new Promise(resolve => {
      switch (type) {
        case 'fade':
          this.currentTransition = new FadeTransition({ duration });
          break;
        case 'pixelate':
          this.currentTransition = new PixelateTransition({ duration });
          break;
      }

      const checkComplete = () => {
        if (this.currentTransition?.isFinished()) {
          this.currentTransition = null;
          resolve();
        }
      };

      const transitionInterval = setInterval(() => {
        if (this.currentTransition?.isFinished()) {
          clearInterval(transitionInterval);
          checkComplete();
        }
      }, 16);
    });
  }
}
