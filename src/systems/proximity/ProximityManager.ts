import { Entity } from '../../systems/entities/EntityRegistry';
import { Position } from '../../state/types';
import { store } from '../../state/store';
import { socketService } from '../../network/socket/socketService';
import { serializeMessage } from '../../network/socket/serialization';

interface ProximityZone {
  id: string;
  center: Position;
  radius: number;
  entities: Set<string>;
  subscribed: boolean;
}

export class ProximityManager {
  private static readonly ZONE_SIZE = 500; // pixels
  private static readonly UPDATE_INTERVAL = 1000; // ms
  private static readonly MAX_ZONES = 9; // 3x3 grid around player

  private zones = new Map<string, ProximityZone>();
  private playerPosition: Position = { x: 0, y: 0 };
  private updateInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startUpdates();
  }

  public updatePlayerPosition(position: Position): void {
    this.playerPosition = position;
    this.updateZones();
  }

  private startUpdates(): void {
    this.updateInterval = setInterval(() => {
      this.updateZones();
    }, ProximityManager.UPDATE_INTERVAL);
  }

  public stop(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  private updateZones(): void {
    // Calculate current zone
    const currentZoneX = Math.floor(this.playerPosition.x / ProximityManager.ZONE_SIZE);
    const currentZoneY = Math.floor(this.playerPosition.y / ProximityManager.ZONE_SIZE);

    // Create set of zones we want to subscribe to
    const desiredZones = new Set<string>();
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const zoneX = currentZoneX + dx;
        const zoneY = currentZoneY + dy;
        const zoneId = `${zoneX},${zoneY}`;
        desiredZones.add(zoneId);

        // Create zone if it doesn't exist
        if (!this.zones.has(zoneId)) {
          this.zones.set(zoneId, {
            id: zoneId,
            center: {
              x: (zoneX + 0.5) * ProximityManager.ZONE_SIZE,
              y: (zoneY + 0.5) * ProximityManager.ZONE_SIZE,
            },
            radius: Math.sqrt(2) * ProximityManager.ZONE_SIZE / 2,
            entities: new Set(),
            subscribed: false,
          });
        }
      }
    }

    // Subscribe to new zones and unsubscribe from old ones
    this.zones.forEach((zone, zoneId) => {
      if (desiredZones.has(zoneId) && !zone.subscribed) {
        this.subscribeToZone(zone);
      } else if (!desiredZones.has(zoneId) && zone.subscribed) {
        this.unsubscribeFromZone(zone);
      }
    });

    // Clean up old zones
    this.zones.forEach((zone, zoneId) => {
      if (!desiredZones.has(zoneId) && zone.entities.size === 0) {
        this.zones.delete(zoneId);
      }
    });
  }

  private subscribeToZone(zone: ProximityZone): void {
    zone.subscribed = true;
    socketService.getClient().emit('room:join', zone.id);
  }

  private unsubscribeFromZone(zone: ProximityZone): void {
    zone.subscribed = false;
    socketService.getClient().emit('room:leave', zone.id);
  }

  public addEntity(entity: Entity): void {
    const position = (entity.data as any).position as Position;
    if (!position) return;

    // Find zone for entity
    const zoneX = Math.floor(position.x / ProximityManager.ZONE_SIZE);
    const zoneY = Math.floor(position.y / ProximityManager.ZONE_SIZE);
    const zoneId = `${zoneX},${zoneY}`;

    // Add entity to zone
    let zone = this.zones.get(zoneId);
    if (!zone) {
      zone = {
        id: zoneId,
        center: {
          x: (zoneX + 0.5) * ProximityManager.ZONE_SIZE,
          y: (zoneY + 0.5) * ProximityManager.ZONE_SIZE,
        },
        radius: Math.sqrt(2) * ProximityManager.ZONE_SIZE / 2,
        entities: new Set(),
        subscribed: false,
      };
      this.zones.set(zoneId, zone);
    }

    zone.entities.add(entity.id);
  }

  public removeEntity(entityId: string): void {
    // Remove entity from all zones
    this.zones.forEach(zone => {
      zone.entities.delete(entityId);
    });
  }

  public updateEntityPosition(entity: Entity, newPosition: Position): void {
    // Remove from old zone
    this.removeEntity(entity.id);

    // Add to new zone
    const zoneX = Math.floor(newPosition.x / ProximityManager.ZONE_SIZE);
    const zoneY = Math.floor(newPosition.y / ProximityManager.ZONE_SIZE);
    const zoneId = `${zoneX},${zoneY}`;

    let zone = this.zones.get(zoneId);
    if (!zone) {
      zone = {
        id: zoneId,
        center: {
          x: (zoneX + 0.5) * ProximityManager.ZONE_SIZE,
          y: (zoneY + 0.5) * ProximityManager.ZONE_SIZE,
        },
        radius: Math.sqrt(2) * ProximityManager.ZONE_SIZE / 2,
        entities: new Set(),
        subscribed: false,
      };
      this.zones.set(zoneId, zone);
    }

    zone.entities.add(entity.id);
  }

  public getEntitiesInRange(position: Position, range: number): string[] {
    const nearbyEntities: string[] = [];

    // Calculate zones that could contain entities within range
    const minZoneX = Math.floor((position.x - range) / ProximityManager.ZONE_SIZE);
    const maxZoneX = Math.floor((position.x + range) / ProximityManager.ZONE_SIZE);
    const minZoneY = Math.floor((position.y - range) / ProximityManager.ZONE_SIZE);
    const maxZoneY = Math.floor((position.y + range) / ProximityManager.ZONE_SIZE);

    // Check each potential zone
    for (let zoneX = minZoneX; zoneX <= maxZoneX; zoneX++) {
      for (let zoneY = minZoneY; zoneY <= maxZoneY; zoneY++) {
        const zoneId = `${zoneX},${zoneY}`;
        const zone = this.zones.get(zoneId);
        if (zone) {
          // Add entities from this zone that are within range
          zone.entities.forEach(entityId => {
            const entity = store.getState().game.entityRegistry.entities[entityId];
            if (entity) {
              const entityPosition = (entity.data as any).position as Position;
              if (entityPosition) {
                const distance = this.calculateDistance(position, entityPosition);
                if (distance <= range) {
                  nearbyEntities.push(entityId);
                }
              }
            }
          });
        }
      }
    }

    return nearbyEntities;
  }

  private calculateDistance(pos1: Position, pos2: Position): number {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
} 