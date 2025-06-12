import { Application, Text } from 'pixi.js';
import gsap from 'gsap';
import type { Sprite, Ticker } from 'pixi.js';

export type Direction = 'clockwise' | 'counterclockwise';

export interface CombinationStep {
  number: number;
  direction: Direction;
}

interface State {
  secretCombination?: CombinationStep[];
  inputSequence: CombinationStep[];
  currentStepCount: number;
  currentDirection: Direction | null;
  unlocked: boolean;
} 