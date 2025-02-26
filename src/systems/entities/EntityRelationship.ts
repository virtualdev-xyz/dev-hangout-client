export type RelationType =
  | 'owns' // Character owns item
  | 'follows' // Character follows another character
  | 'interacts' // Character can interact with object
  | 'blocks' // Object blocks movement
  | 'requires' // Object requires another object/state
  | 'triggers'; // Object triggers another object

export interface Relationship {
  sourceId: string;
  targetId: string;
  type: RelationType;
  metadata?: Record<string, any>;
}

export class EntityRelationshipManager {
  private relationships: Map<string, Relationship[]> = new Map();

  addRelationship(relationship: Relationship): void {
    const { sourceId } = relationship;
    if (!this.relationships.has(sourceId)) {
      this.relationships.set(sourceId, []);
    }
    this.relationships.get(sourceId)!.push(relationship);
  }

  removeRelationship(sourceId: string, targetId: string, type: RelationType): void {
    const relationships = this.relationships.get(sourceId);
    if (!relationships) return;

    const index = relationships.findIndex(r => r.targetId === targetId && r.type === type);

    if (index !== -1) {
      relationships.splice(index, 1);
    }
  }

  getRelationships(sourceId: string, type?: RelationType): Relationship[] {
    const relationships = this.relationships.get(sourceId) || [];
    return type ? relationships.filter(r => r.type === type) : relationships;
  }

  hasRelationship(sourceId: string, targetId: string, type: RelationType): boolean {
    const relationships = this.relationships.get(sourceId);
    if (!relationships) return false;

    return relationships.some(r => r.targetId === targetId && r.type === type);
  }

  getRelatedEntities(sourceId: string, type: RelationType): string[] {
    const relationships = this.relationships.get(sourceId);
    if (!relationships) return [];

    return relationships.filter(r => r.type === type).map(r => r.targetId);
  }

  clearRelationships(sourceId: string): void {
    this.relationships.delete(sourceId);
  }
}
