import { SpriteSheet, SpriteSheetConfig } from '../SpriteSheet';
import { AnimationController, Animation } from '../../animation/AnimationController';

export interface CharacterAnimations {
  idle: {
    down: number[];
    up: number[];
    left: number[];
    right: number[];
  };
  walk: {
    down: number[];
    up: number[];
    left: number[];
    right: number[];
  };
  action: {
    down: number[];
    up: number[];
    left: number[];
    right: number[];
  };
}

export class CharacterSprite {
  private spriteSheet: SpriteSheet;
  private animationController: AnimationController | null = null;
  private currentFrame: { x: number; y: number } = { x: 0, y: 0 };
  private readonly FRAME_SIZE = 32; // 32x32 pixel sprites

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
  }

  private createAnimationFrames() {
    const frames: Record<string, { x: number; y: number; width: number; height: number }[]> = {};
    
    // Convert animation indices to frame coordinates
    Object.entries(this.animations).forEach(([action, directions]) => {
      Object.entries(directions).forEach(([direction, frameIndices]) => {
        const animationKey = `${action}_${direction}`;
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

  private createAnimation(action: string, direction: string): Animation {
    const frameIndices = this.animations[action][direction];
    return {
      frames: frameIndices.map(index => ({
        duration: 150, // 150ms per frame
        spriteX: (index % 8) * this.FRAME_SIZE,
        spriteY: Math.floor(index / 8) * this.FRAME_SIZE
      })),
      loop: action === 'walk' || action === 'idle'
    };
  }

  setAnimation(action: keyof CharacterAnimations, direction: keyof CharacterAnimations['idle']): void {
    const newAnimation = this.createAnimation(action, direction);
    
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
} 