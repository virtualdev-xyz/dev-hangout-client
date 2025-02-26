export type AssetType = 'image' | 'spritesheet' | 'audio';

export interface AssetConfig {
  type: AssetType;
  url: string;
  id: string;
  metadata?: Record<string, any>;
}

export class AssetLoader {
  private assets: Map<string, any> = new Map();
  private loadingPromises: Map<string, Promise<any>> = new Map();

  async loadAsset(config: AssetConfig): Promise<void> {
    if (this.loadingPromises.has(config.id)) {
      await this.loadingPromises.get(config.id);
      return;
    }

    const loadPromise = this.createLoadPromise(config);
    this.loadingPromises.set(config.id, loadPromise);

    try {
      const asset = await loadPromise;
      this.assets.set(config.id, asset);
    } catch (error) {
      console.error(`Failed to load asset ${config.id}:`, error);
      throw error;
    }
  }

  getAsset<T>(id: string): T | undefined {
    return this.assets.get(id) as T;
  }

  private createLoadPromise(config: AssetConfig): Promise<any> {
    switch (config.type) {
      case 'image':
        return this.loadImage(config.url);
      case 'spritesheet':
        return this.loadSpritesheet(config);
      case 'audio':
        return this.loadAudio(config.url);
      default:
        throw new Error(`Unsupported asset type: ${config.type}`);
    }
  }

  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  private loadSpritesheet(config: AssetConfig): Promise<HTMLImageElement> {
    return this.loadImage(config.url);
  }

  private loadAudio(url: string): Promise<HTMLAudioElement> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.oncanplaythrough = () => resolve(audio);
      audio.onerror = reject;
      audio.src = url;
    });
  }
}
