import { CharacterAnimations } from '../systems/rendering/sprites/CharacterSprite';

export const defaultCharacterAnimations: CharacterAnimations = {
  idle: {
    down:  [0],       // Single frame for idle
    up:    [8],
    left:  [16],
    right: [24]
  },
  walk: {
    down:  [1, 2, 3, 2],  // 4-frame walk cycle
    up:    [9, 10, 11, 10],
    left:  [17, 18, 19, 18],
    right: [25, 26, 27, 26]
  },
  action: {
    down:  [4, 5],    // 2-frame action
    up:    [12, 13],
    left:  [20, 21],
    right: [28, 29]
  }
}; 