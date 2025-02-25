import { AssetLoader, AssetConfig } from './AssetLoader';

export class AssetManager {
  private loader: AssetLoader;
  private loadQueue: AssetConfig[] = [];
  private isLoading: boolean = false;

  constructor() {
    this.loader = new AssetLoader();
  }

  queueAsset(config: AssetConfig): void {
    this.loadQueue.push(config);
  }

  async loadAll(): Promise<void> {
    if (this.isLoading) return;
    this.isLoading = true;

    try {
      await Promise.all(
        this.loadQueue.map(config => this.loader.loadAsset(config))
      );
      this.loadQueue = [];
    } finally {
      this.isLoading = false;
    }
  }

  getAsset<T>(id: string): T | undefined {
    return this.loader.getAsset<T>(id);
  }
} 