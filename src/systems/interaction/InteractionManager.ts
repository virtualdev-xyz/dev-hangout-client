export interface Interactable {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  interactionRadius: number;
  onInteract: () => void;
  getInteractionPrompt?: () => string;
}

export class InteractionManager {
  private interactables: Map<string, Interactable> = new Map();
  private readonly DEFAULT_INTERACTION_RADIUS = 32;

  register(interactable: Interactable): void {
    this.interactables.set(interactable.id, interactable);
  }

  unregister(id: string): void {
    this.interactables.delete(id);
  }

  findInteractableInRange(x: number, y: number): Interactable | null {
    for (const interactable of this.interactables.values()) {
      if (this.isInRange(x, y, interactable)) {
        return interactable;
      }
    }
    return null;
  }

  private isInRange(x: number, y: number, interactable: Interactable): boolean {
    const dx = x - (interactable.x + interactable.width / 2);
    const dy = y - (interactable.y + interactable.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= (interactable.interactionRadius || this.DEFAULT_INTERACTION_RADIUS);
  }

  // Debug visualization
  drawDebug(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.globalAlpha = 0.2;

    for (const interactable of this.interactables.values()) {
      // Draw interaction radius
      ctx.beginPath();
      ctx.arc(
        interactable.x + interactable.width / 2,
        interactable.y + interactable.height / 2,
        interactable.interactionRadius || this.DEFAULT_INTERACTION_RADIUS,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = '#00FF00';
      ctx.fill();

      // Draw object bounds
      ctx.strokeStyle = '#FFFF00';
      ctx.strokeRect(
        interactable.x,
        interactable.y,
        interactable.width,
        interactable.height
      );
    }

    ctx.restore();
  }
} 