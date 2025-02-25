import { CharacterAnimations } from '../systems/rendering/sprites/CharacterSprite';

export const defaultCharacterAnimations: CharacterAnimations = {
  idle: {
    down:  [0, 1],        // First row, frames 0-1
    up:    [8, 9],        // Second row, frames 0-1
    left:  [16, 17],      // Third row, frames 0-1
    right: [24, 25]       // Fourth row, frames 0-1
  },
  walk: {
    down:  [2, 3, 4, 5],  // First row, frames 2-5
    up:    [10, 11, 12, 13], // Second row, frames 2-5
    left:  [18, 19, 20, 21], // Third row, frames 2-5
    right: [26, 27, 28, 29]  // Fourth row, frames 2-5
  },
  action: {
    down:  [6, 7],        // First row, frames 6-7
    up:    [14, 15],      // Second row, frames 6-7
    left:  [22, 23],      // Third row, frames 6-7
    right: [30, 31]       // Fourth row, frames 6-7
  }
}; 