import { Position } from '../../state/types';
import { store } from '../../state/store';
import { setPlayerPosition } from '../../state/slices/gameSlice';
import { socketService } from '../../network/socket/socketService';
import { serializeMessage, PlayerMoveMessage } from '../../network/socket/serialization';

interface MovementInput {
  direction: 'up' | 'down' | 'left' | 'right';
  delta: number;
}

interface PredictionState {
  position: Position;
  timestamp: number;
  input: MovementInput;
  sequence: number;
}

export class MovementPrediction {
  private static readonly MOVEMENT_SPEED = 200; // pixels per second
  private static readonly RECONCILIATION_THRESHOLD = 5; // pixels
  private static readonly MAX_PREDICTION_BUFFER = 60; // frames

  private lastProcessedInput = 0;
  private pendingInputs: PredictionState[] = [];
  private serverPosition: Position = { x: 0, y: 0 };
  private reconciling = false;

  constructor(private playerId: string) {}

  public applyInput(input: MovementInput): void {
    const currentState = store.getState().game.player;
    const sequence = ++this.lastProcessedInput;

    // Calculate predicted position
    const predictedPosition = this.calculateNewPosition(currentState.position, input);

    // Save prediction state
    this.pendingInputs.push({
      position: predictedPosition,
      timestamp: Date.now(),
      input,
      sequence,
    });

    // Trim prediction buffer if too large
    if (this.pendingInputs.length > MovementPrediction.MAX_PREDICTION_BUFFER) {
      this.pendingInputs.shift();
    }

    // Apply prediction locally
    store.dispatch(setPlayerPosition(predictedPosition));

    // Send input to server
    const message: PlayerMoveMessage = {
      playerId: this.playerId,
      position: predictedPosition,
      timestamp: Date.now(),
      input,
    };

    socketService.getClient().emit('player:move', message.position);
  }

  public handleServerUpdate(position: Position, lastProcessedInput?: number): void {
    this.serverPosition = position;

    // If we received a lastProcessedInput, we can remove older inputs
    if (lastProcessedInput !== undefined) {
      this.pendingInputs = this.pendingInputs.filter(input => input.sequence > lastProcessedInput);
    }

    // Check if we need to reconcile
    const currentPosition = store.getState().game.player.position;
    const distance = this.calculateDistance(currentPosition, position);

    if (distance > MovementPrediction.RECONCILIATION_THRESHOLD) {
      this.reconcile();
    }

    // Reapply pending inputs
    let predictedPosition = { ...position };
    this.pendingInputs.forEach(pendingInput => {
      predictedPosition = this.calculateNewPosition(predictedPosition, pendingInput.input);
    });

    // Update position if different from current prediction
    if (predictedPosition.x !== currentPosition.x || predictedPosition.y !== currentPosition.y) {
      store.dispatch(setPlayerPosition(predictedPosition));
    }
  }

  private calculateNewPosition(currentPosition: Position, input: MovementInput): Position {
    const distance = (MovementPrediction.MOVEMENT_SPEED * input.delta) / 1000;
    const newPosition = { ...currentPosition };

    switch (input.direction) {
      case 'up':
        newPosition.y -= distance;
        break;
      case 'down':
        newPosition.y += distance;
        break;
      case 'left':
        newPosition.x -= distance;
        break;
      case 'right':
        newPosition.x += distance;
        break;
    }

    return newPosition;
  }

  private calculateDistance(pos1: Position, pos2: Position): number {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private reconcile(): void {
    if (this.reconciling) return;
    this.reconciling = true;

    // Reset to server position
    store.dispatch(setPlayerPosition(this.serverPosition));

    // Reapply pending inputs with interpolation
    let currentPosition = { ...this.serverPosition };
    const startTime = Date.now();
    const totalSteps = this.pendingInputs.length;
    let currentStep = 0;

    const interpolate = () => {
      if (currentStep >= totalSteps) {
        this.reconciling = false;
        return;
      }

      const input = this.pendingInputs[currentStep];
      currentPosition = this.calculateNewPosition(currentPosition, input.input);
      store.dispatch(setPlayerPosition(currentPosition));
      currentStep++;

      requestAnimationFrame(interpolate);
    };

    requestAnimationFrame(interpolate);
  }
} 