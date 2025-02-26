export interface NameTagConfig {
  text: string;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  font?: string;
  fontSize?: number;
  padding?: number;
  offset?: { x: number; y: number };
}

export interface StatusIndicator {
  type: 'online' | 'away' | 'busy' | 'offline';
  customColor?: string;
}

export class NameTag {
  private readonly DEFAULT_CONFIG = {
    color: '#FFFFFF',
    backgroundColor: '#000000AA',
    borderColor: '#00FFFF',
    font: 'Press Start 2P',
    fontSize: 12,
    padding: 4,
    offset: { x: 0, y: -32 },
  };

  private config: Required<NameTagConfig>;
  private statusIndicator: StatusIndicator | null = null;
  private cachedWidth: number = 0;

  constructor(config: NameTagConfig) {
    this.config = { ...this.DEFAULT_CONFIG, ...config };
    this.updateCachedWidth();
  }

  private updateCachedWidth(): void {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.font = `${this.config.fontSize}px ${this.config.font}`;
    this.cachedWidth = tempCtx.measureText(this.config.text).width;
  }

  setStatus(status: StatusIndicator | null): void {
    this.statusIndicator = status;
  }

  draw(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    const { text, color, backgroundColor, borderColor, fontSize, font, padding, offset } =
      this.config;

    // Calculate position
    const tagWidth = this.cachedWidth + padding * 2;
    const tagHeight = fontSize + padding * 2;
    const tagX = x + offset.x - tagWidth / 2;
    const tagY = y + offset.y;

    // Save context state
    ctx.save();

    // Draw background
    ctx.fillStyle = backgroundColor;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    this.drawPixelatedRect(ctx, tagX, tagY, tagWidth, tagHeight);
    ctx.stroke();
    ctx.fill();

    // Draw text
    ctx.font = `${fontSize}px ${font}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.fillText(text, tagX + tagWidth / 2, tagY + tagHeight / 2);

    // Draw status indicator if present
    if (this.statusIndicator) {
      this.drawStatusIndicator(ctx, tagX + tagWidth + 4, tagY + tagHeight / 2);
    }

    // Restore context state
    ctx.restore();
  }

  private drawStatusIndicator(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    if (!this.statusIndicator) return;

    const radius = 4;
    const color =
      this.statusIndicator.customColor || this.getStatusColor(this.statusIndicator.type);

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  private drawPixelatedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    // Draw a rectangle with pixelated corners
    ctx.beginPath();
    ctx.moveTo(x + 2, y);
    ctx.lineTo(x + width - 2, y);
    ctx.lineTo(x + width, y + 2);
    ctx.lineTo(x + width, y + height - 2);
    ctx.lineTo(x + width - 2, y + height);
    ctx.lineTo(x + 2, y + height);
    ctx.lineTo(x, y + height - 2);
    ctx.lineTo(x, y + 2);
    ctx.closePath();
  }

  private getStatusColor(status: StatusIndicator['type']): string {
    switch (status) {
      case 'online':
        return '#00FF00';
      case 'away':
        return '#FFFF00';
      case 'busy':
        return '#FF0000';
      case 'offline':
        return '#808080';
    }
  }

  setText(text: string): void {
    this.config.text = text;
    this.updateCachedWidth();
  }

  setColor(color: string): void {
    this.config.color = color;
  }
}
