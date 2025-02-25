export interface AnimationFrame {
  duration: number;
  spriteX: number;
  spriteY: number;
}

export interface Animation {
  frames: AnimationFrame[];
  loop: boolean;
}

export class AnimationController {
  private currentTime: number = 0;
  private currentFrameIndex: number = 0;
  private isPlaying: boolean = true;

  constructor(
    private animation: Animation,
    private onFrame: (frame: AnimationFrame) => void,
    private onComplete?: () => void
  ) {}

  update(deltaTime: number): void {
    if (!this.isPlaying) return;

    this.currentTime += deltaTime;
    const currentFrame = this.animation.frames[this.currentFrameIndex];

    if (this.currentTime >= currentFrame.duration) {
      this.currentTime = 0;
      this.currentFrameIndex++;

      if (this.currentFrameIndex >= this.animation.frames.length) {
        if (this.animation.loop) {
          this.currentFrameIndex = 0;
        } else {
          this.currentFrameIndex = this.animation.frames.length - 1;
          this.isPlaying = false;
          this.onComplete?.();
          return;
        }
      }

      this.onFrame(this.animation.frames[this.currentFrameIndex]);
    }
  }

  play(): void {
    this.isPlaying = true;
  }

  pause(): void {
    this.isPlaying = false;
  }

  reset(): void {
    this.currentTime = 0;
    this.currentFrameIndex = 0;
    this.isPlaying = true;
    this.onFrame(this.animation.frames[0]);
  }
} 