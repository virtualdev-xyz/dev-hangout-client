import { Character } from '../../state/types';
import { InteractableEntity } from '../../state/types';
import { EntityRelationshipManager, RelationType } from './EntityRelationship';

export type EntityType = 'character' | 'interactable' | 'item';

export interface Entity {
  id: string;
  type: EntityType;
  data: Character | InteractableEntity | any;
}

export class EntityRegistry {
  private entities: Map<string, Entity> = new Map();
  private relationshipManager: EntityRelationshipManager;

  constructor() {
    this.relationshipManager = new EntityRelationshipManager();
  }

  register(entity: Entity): void {
    this.entities.set(entity.id, entity);
  }

  unregister(id: string): void {
    this.entities.delete(id);
    this.relationshipManager.clearRelationships(id);
  }

  getEntity<T>(id: string): T | null {
    const entity = this.entities.get(id);
    return entity ? (entity.data as T) : null;
  }

  getEntitiesByType(type: EntityType): Entity[] {
    return Array.from(this.entities.values()).filter(entity => entity.type === type);
  }

  addRelationship(
    sourceId: string,
    targetId: string,
    type: RelationType,
    metadata?: Record<string, any>
  ): void {
    if (!this.entities.has(sourceId) || !this.entities.has(targetId)) {
      throw new Error('Source or target entity does not exist');
    }

    this.relationshipManager.addRelationship({
      sourceId,
      targetId,
      type,
      metadata,
    });
  }

  getRelatedEntities<T>(sourceId: string, type: RelationType): T[] {
    const relatedIds = this.relationshipManager.getRelatedEntities(sourceId, type);
    return relatedIds
      .map(id => this.getEntity<T>(id))
      .filter((entity): entity is T => entity !== null);
  }

  hasRelationship(sourceId: string, targetId: string, type: RelationType): boolean {
    return this.relationshipManager.hasRelationship(sourceId, targetId, type);
  }

  update(deltaTime: number): void {
    // Update all entities that need updating
    for (const entity of this.entities.values()) {
      if ('update' in entity.data && typeof entity.data.update === 'function') {
        entity.data.update(deltaTime);
      }
    }
  }
}
