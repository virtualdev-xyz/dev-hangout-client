import { SpriteSheet, SpriteSheetConfig } from '../SpriteSheet';
import { AnimationController, Animation } from '../../animation/AnimationController';

export type Direction = 'up' | 'down' | 'left' | 'right';
export type CharacterState = 'idle' | 'walk' | 'action';

export interface CharacterAnimations {
  idle: Record<Direction, number[]>;
  walk: Record<Direction, number[]>;
  action: Record<Direction, number[]>;
}

export class CharacterSprite {
  private spriteSheet: SpriteSheet;
  private animationController: AnimationController | null = null;
  private currentFrame: { x: number; y: number } = { x: 0, y: 0 };
  private readonly FRAME_SIZE = 32; // 32x32 pixel sprites
  private currentDirection: Direction = 'down';
  private currentState: CharacterState = 'idle';
  private velocity: { x: number; y: number } = { x: 0, y: 0 };

  constructor(
    context: CanvasRenderingContext2D,
    imageUrl: string,
    private animations: CharacterAnimations
  ) {
    const config: SpriteSheetConfig = {
      imageUrl,
      frameWidth: this.FRAME_SIZE,
      frameHeight: this.FRAME_SIZE,
      animations: this.createAnimationFrames()
    };

    this.spriteSheet = new SpriteSheet(config, context);
    this.setAnimation('idle', 'down');
  }

  setVelocity(x: number, y: number): void {
    this.velocity.x = x;
    this.velocity.y = y;
    this.updateStateAndDirection();
  }

  private updateStateAndDirection(): void {
    const { x, y } = this.velocity;
    const speed = Math.sqrt(x * x + y * y);
    const newState: CharacterState = speed > 0 ? 'walk' : 'idle';

    let newDirection: Direction = this.currentDirection;
    if (Math.abs(x) > Math.abs(y)) {
      newDirection = x > 0 ? 'right' : 'left';
    } else if (y !== 0) {
      newDirection = y > 0 ? 'down' : 'up';
    }

    if (newState !== this.currentState || newDirection !== this.currentDirection) {
      this.currentState = newState;
      this.currentDirection = newDirection;
      this.setAnimation(this.currentState, this.currentDirection);
    }
  }

  private createAnimationFrames() {
    const frames: Record<string, { x: number; y: number; width: number; height: number }[]> = {};
    
    // Convert animation indices to frame coordinates
    Object.entries(this.animations).forEach(([state, directions]) => {
      Object.entries(directions).forEach(([direction, frameIndices]) => {
        const animationKey = `${state}_${direction}`;
        frames[animationKey] = frameIndices.map(index => ({
          x: (index % 8) * this.FRAME_SIZE, // 8 frames per row
          y: Math.floor(index / 8) * this.FRAME_SIZE,
          width: this.FRAME_SIZE,
          height: this.FRAME_SIZE
        }));
      });
    });

    return frames;
  }

  private createAnimation(state: CharacterState, direction: Direction): Animation {
    const frameIndices = this.animations[state][direction];
    return {
      frames: frameIndices.map(index => ({
        duration: state === 'walk' ? 100 : 200, // Faster walk animation
        spriteX: (index % 8) * this.FRAME_SIZE,
        spriteY: Math.floor(index / 8) * this.FRAME_SIZE
      })),
      loop: state === 'walk' || state === 'idle'
    };
  }

  setAnimation(state: CharacterState, direction: Direction): void {
    const newAnimation = this.createAnimation(state, direction);
    
    this.animationController = new AnimationController(
      newAnimation,
      frame => {
        this.currentFrame.x = frame.spriteX;
        this.currentFrame.y = frame.spriteY;
      }
    );
  }

  update(deltaTime: number): void {
    this.animationController?.update(deltaTime);
  }

  draw(x: number, y: number): void {
    this.spriteSheet.drawFrame(
      this.currentFrame.x,
      this.currentFrame.y,
      this.FRAME_SIZE,
      this.FRAME_SIZE,
      x,
      y
    );
  }

  getCurrentDirection(): Direction {
    return this.currentDirection;
  }

  getCurrentState(): CharacterState {
    return this.currentState;
  }
} 