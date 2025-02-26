import { Interactable } from './InteractionManager';

export class InteractableObject implements Interactable {
  constructor(
    public id: string,
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public interactionRadius: number,
    private prompt: string,
    private onInteractCallback: () => void
  ) {}

  onInteract(): void {
    this.onInteractCallback();
  }

  getInteractionPrompt(): string {
    return this.prompt;
  }
}
