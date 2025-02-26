export type KeyMap = {
  up: string;
  down: string;
  left: string;
  right: string;
  action: string;
};

export interface InputState {
  horizontal: number; // -1 (left), 0, or 1 (right)
  vertical: number; // -1 (up), 0, or 1 (down)
  action: boolean;
}

export class KeyboardController {
  private keys: Set<string> = new Set();
  private inputState: InputState = {
    horizontal: 0,
    vertical: 0,
    action: false,
  };

  constructor(
    private keyMap: KeyMap = {
      up: 'ArrowUp',
      down: 'ArrowDown',
      left: 'ArrowLeft',
      right: 'ArrowRight',
      action: 'Space',
    }
  ) {
    this.setupListeners();
  }

  private setupListeners(): void {
    window.addEventListener('keydown', e => {
      this.keys.add(e.code);
      this.updateInputState();
    });

    window.addEventListener('keyup', e => {
      this.keys.delete(e.code);
      this.updateInputState();
    });

    // Prevent browser scrolling with arrow keys
    window.addEventListener('keydown', e => {
      if (['ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
    });
  }

  private updateInputState(): void {
    // Handle horizontal movement
    let horizontal = 0;
    if (this.keys.has(this.keyMap.left)) horizontal -= 1;
    if (this.keys.has(this.keyMap.right)) horizontal += 1;

    // Handle vertical movement
    let vertical = 0;
    if (this.keys.has(this.keyMap.up)) vertical -= 1;
    if (this.keys.has(this.keyMap.down)) vertical += 1;

    // Normalize diagonal movement
    if (horizontal !== 0 && vertical !== 0) {
      const normalizer = Math.SQRT1_2; // 1/√2
      horizontal *= normalizer;
      vertical *= normalizer;
    }

    this.inputState = {
      horizontal,
      vertical,
      action: this.keys.has(this.keyMap.action),
    };
  }

  getInputState(): InputState {
    return { ...this.inputState };
  }

  cleanup(): void {
    window.removeEventListener('keydown', this.setupListeners);
    window.removeEventListener('keyup', this.setupListeners);
  }
}
