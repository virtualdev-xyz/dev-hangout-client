import { SpriteSheet, SpriteSheetConfig } from '../SpriteSheet';
import { AnimationController, Animation } from '../../animation/AnimationController';
import { CharacterCustomization, ColorPalette } from './CharacterCustomization';
import { NameTag, NameTagConfig } from '../ui/NameTag';
import { KeyboardController, InputState } from '../../input/KeyboardController';
import { GridMovement, MovementConfig } from '../../movement/GridMovement';

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
  private customization: CharacterCustomization;
  private nameTag: NameTag | null = null;
  private keyboardController: KeyboardController;
  private readonly MOVEMENT_SPEED = 3;
  private gridMovement: GridMovement;

  constructor(
    context: CanvasRenderingContext2D,
    imageUrl: string,
    private animations: CharacterAnimations,
    defaultPalette: ColorPalette,
    nameTagConfig?: NameTagConfig,
    movementConfig?: MovementConfig
  ) {
    const config: SpriteSheetConfig = {
      imageUrl,
      frameWidth: this.FRAME_SIZE,
      frameHeight: this.FRAME_SIZE,
      animations: this.createAnimationFrames()
    };

    this.spriteSheet = new SpriteSheet(config, context);
    this.setAnimation('idle', 'down');

    this.customization = new CharacterCustomization(
      this.FRAME_SIZE * 8, // Full spritesheet width
      this.FRAME_SIZE * 4, // Full spritesheet height
      defaultPalette
    );
    
    this.customization.loadBaseSprite(imageUrl).then(() => {
      this.customization.updatePalette(defaultPalette);
    });

    if (nameTagConfig) {
      this.nameTag = new NameTag(nameTagConfig);
    }

    this.keyboardController = new KeyboardController();

    this.gridMovement = new GridMovement(movementConfig);
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
    // Update animation
    this.animationController?.update(deltaTime);

    // Update movement based on input
    const input = this.keyboardController.getInputState();
    this.handleInput(input, deltaTime);
  }

  private handleInput(input: InputState, deltaTime: number): void {
    // Only try to move if not already moving
    if (!this.gridMovement.isMovementInProgress()) {
      const moved = this.gridMovement.moveInDirection(
        input.horizontal,
        input.vertical
      );

      if (moved) {
        // Update animation state based on movement direction
        this.setVelocity(input.horizontal, input.vertical);
      } else {
        // No movement, return to idle
        this.setVelocity(0, 0);
      }
    }

    // Update grid movement
    this.gridMovement.update(deltaTime);

    // Get interpolated position
    const worldPos = this.gridMovement.getWorldPosition();
    this.x = worldPos.x;
    this.y = worldPos.y;

    // Handle action button
    if (input.action) {
      this.performAction();
    }
  }

  private performAction(): void {
    if (this.currentState !== 'action') {
      this.setAnimation('action', this.currentDirection);
    }
  }

  updateColors(newPalette: Partial<ColorPalette>): void {
    this.customization.updatePalette(newPalette);
  }

  draw(x: number, y: number): void {
    this.customization.drawCustomizedSprite(
      this.spriteSheet.getContext(),
      this.currentFrame.x,
      this.currentFrame.y,
      this.FRAME_SIZE,
      this.FRAME_SIZE,
      x,
      y
    );

    if (this.nameTag) {
      this.nameTag.draw(this.spriteSheet.getContext(), x + this.FRAME_SIZE/2, y);
    }
  }

  getCurrentDirection(): Direction {
    return this.currentDirection;
  }

  getCurrentState(): CharacterState {
    return this.currentState;
  }

  setNameTag(config: NameTagConfig): void {
    this.nameTag = new NameTag(config);
  }

  setStatus(status: StatusIndicator | null): void {
    this.nameTag?.setStatus(status);
  }

  cleanup(): void {
    this.keyboardController.cleanup();
  }

  setPosition(x: number, y: number): void {
    this.gridMovement.setPosition(x, y);
    this.x = x;
    this.y = y;
  }
} 