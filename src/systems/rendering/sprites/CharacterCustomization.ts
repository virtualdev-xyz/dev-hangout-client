export interface ColorPalette {
  skin: string;
  hair: string;
  shirt: string;
  pants: string;
  shoes: string;
}

export interface Accessory {
  id: string;
  spriteX: number;
  spriteY: number;
  width: number;
  height: number;
  layer: 'behind' | 'front'; // Layer order relative to character
  offset: { x: number; y: number }; // Position offset from character
}

export class CharacterCustomization {
  private colorCanvas: HTMLCanvasElement;
  private colorCtx: CanvasRenderingContext2D;
  private baseImage: HTMLImageElement | null = null;
  private accessories: Map<string, Accessory> = new Map();

  constructor(
    private width: number,
    private height: number,
    private defaultPalette: ColorPalette
  ) {
    this.colorCanvas = document.createElement('canvas');
    this.colorCanvas.width = width;
    this.colorCanvas.height = height;
    this.colorCtx = this.colorCanvas.getContext('2d')!;
  }

  async loadBaseSprite(imageUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.baseImage = img;
        resolve();
      };
      img.onerror = reject;
      img.src = imageUrl;
    });
  }

  updatePalette(newPalette: Partial<ColorPalette>): void {
    if (!this.baseImage) return;

    // Draw base image
    this.colorCtx.drawImage(this.baseImage, 0, 0);

    // Get image data for color replacement
    const imageData = this.colorCtx.getImageData(0, 0, this.width, this.height);
    const data = imageData.data;

    // Color mapping (example values, adjust based on your sprite)
    const colorMap = {
      '#FF0000': newPalette.shirt || this.defaultPalette.shirt, // Red pixels to shirt color
      '#00FF00': newPalette.pants || this.defaultPalette.pants, // Green pixels to pants color
      '#0000FF': newPalette.hair || this.defaultPalette.hair, // Blue pixels to hair color
      '#FFFF00': newPalette.skin || this.defaultPalette.skin, // Yellow pixels to skin color
      '#FF00FF': newPalette.shoes || this.defaultPalette.shoes, // Magenta pixels to shoes color
    };

    // Replace colors
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

      if (colorMap[hex]) {
        const newColor = colorMap[hex];
        const rgb = this.hexToRgb(newColor);
        data[i] = rgb.r;
        data[i + 1] = rgb.g;
        data[i + 2] = rgb.b;
      }
    }

    this.colorCtx.putImageData(imageData, 0, 0);
  }

  addAccessory(accessory: Accessory): void {
    this.accessories.set(accessory.id, accessory);
  }

  removeAccessory(id: string): void {
    this.accessories.delete(id);
  }

  drawCustomizedSprite(
    ctx: CanvasRenderingContext2D,
    spriteX: number,
    spriteY: number,
    width: number,
    height: number,
    x: number,
    y: number
  ): void {
    // Draw behind-layer accessories
    this.accessories.forEach(acc => {
      if (acc.layer === 'behind') {
        this.drawAccessory(ctx, acc, x, y);
      }
    });

    // Draw color-swapped character
    ctx.drawImage(this.colorCanvas, spriteX, spriteY, width, height, x, y, width, height);

    // Draw front-layer accessories
    this.accessories.forEach(acc => {
      if (acc.layer === 'front') {
        this.drawAccessory(ctx, acc, x, y);
      }
    });
  }

  private drawAccessory(
    ctx: CanvasRenderingContext2D,
    accessory: Accessory,
    characterX: number,
    characterY: number
  ): void {
    ctx.drawImage(
      this.colorCanvas,
      accessory.spriteX,
      accessory.spriteY,
      accessory.width,
      accessory.height,
      characterX + accessory.offset.x,
      characterY + accessory.offset.y,
      accessory.width,
      accessory.height
    );
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  }
}
