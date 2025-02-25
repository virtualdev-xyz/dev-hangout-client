export interface TransitionConfig {
  duration: number;
  easing?: (t: number) => number;
}

export abstract class Transition {
  protected progress: number = 0;
  private _isComplete: boolean = false;
  
  constructor(protected config: TransitionConfig) {}

  abstract render(ctx: CanvasRenderingContext2D): void;

  update(deltaTime: number): boolean {
    if (this._isComplete) return true;
    
    this.progress += deltaTime / this.config.duration;
    if (this.progress >= 1) {
      this.progress = 1;
      this._isComplete = true;
    }
    
    return this._isComplete;
  }

  protected getEasedProgress(): number {
    return this.config.easing ? 
      this.config.easing(this.progress) : 
      this.progress;
  }

  public isFinished(): boolean {
    return this._isComplete;
  }
} 