import { Application, FederatedPointerEvent, Sprite, Ticker, Point } from 'pixi.js';

const ROTATION_ANGLE: number = Math.PI / 3;
const ROTATION_SPEED: number = 0.05;

export type Direction = 'clockwise' | 'counterclockwise';

export interface CombinationStep {
  number: number;
  direction: Direction;
}

export interface CombinationState {
  inputSequence: CombinationStep[];
  currentStepCount: number;
  currentDirection: Direction | null;
  unlocked: boolean;
}

export function setupHandleInteraction(
  app: Application,
  handle: Sprite,
  handleShadow: Sprite,
  addRotation: (direction: Direction) => void
): void {
  let isRotating: boolean = false;

  handle.eventMode = 'static';
  handle.cursor = 'pointer';

  handle.on('pointerdown', (event: FederatedPointerEvent): void => {
    if (isRotating) return;

    const clickPos: Point = event.global;
    const dirMultiplier: number = clickPos.x > handle.x ? 1 : -1;
    const targetRotation: number = ROTATION_ANGLE * dirMultiplier;

    isRotating = true;
    let accumulated: number = 0;

    const rotateFn = (ticker: Ticker): void => {
      const delta: number = ROTATION_SPEED * ticker.deltaTime * dirMultiplier;
      const nextAccum = accumulated + delta;

    
      if (Math.abs(nextAccum) >= Math.abs(targetRotation)) {
        const remain: number = targetRotation - accumulated;
        handle.rotation += remain;
        handleShadow.rotation += remain;
        app.ticker.remove(rotateFn);
        isRotating = false;
        const direction: Direction = dirMultiplier === 1 ? 'clockwise' : 'counterclockwise';
        addRotation(direction);
        return;
      }

      handle.rotation += delta;
      handleShadow.rotation += delta;
      accumulated = nextAccum;
    };

    app.ticker.add(rotateFn);
  });
}

export function createAddRotation(
  getState: () => CombinationState,
  setState: (newState: CombinationState) => void,
  checkCombination: () => void
): (direction: Direction) => void {
  return (direction: Direction): void => {
    const state: CombinationState = getState();
    if (state.unlocked) return;

    const sequence: CombinationStep[] = [...state.inputSequence];
    let currentDirection: Direction | null = state.currentDirection;
    let currentStepCount: number = state.currentStepCount;

    if (currentDirection !== direction) {
      if (currentDirection !== null) {
        sequence.push({ number: currentStepCount, direction: currentDirection });
      }
      currentDirection = direction;
      currentStepCount = 1;
    } else {
      currentStepCount++;
    }

    setState({
      ...state,
      inputSequence: sequence,
      currentDirection,
      currentStepCount
    });

    checkCombination();
  };
}
