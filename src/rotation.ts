import { Application, Ticker, FederatedPointerEvent, Sprite } from 'pixi.js';

type Direction = 'clockwise' | 'counterclockwise';

export function setupHandleInteraction(
  app: Application,
  handle: Sprite,
  handleShadow: Sprite,
  addRotation: (direction: Direction) => void
): void {
  let isRotating = false;

  handle.eventMode = 'static';
  handle.cursor = 'pointer';

  handle.on('pointerdown', (event: FederatedPointerEvent): void => {
    if (isRotating) return;
    const clickPos = event.data.global;
    const direction = clickPos.x > handle.x ? 1 : -1;
    const target = (Math.PI / 3) * direction;
    isRotating = true;
    let rotated = 0;

    const rotate = (ticker: Ticker): void => {
      const step = 0.05 * ticker.deltaTime * direction;
      if (Math.abs(rotated + step) >= Math.abs(target)) {
        const remaining = target - rotated;
        handle.rotation += remaining;
        handleShadow.rotation += remaining;
        app.ticker.remove(rotate);
        isRotating = false;
        addRotation(direction === 1 ? 'clockwise' : 'counterclockwise');
        return;
      }
      handle.rotation += step;
      handleShadow.rotation += step;
      rotated += step;
    };

    app.ticker.add(rotate);
  });
}

export function createAddRotation(
  getState: () => {
    secretCombination: { number: number; direction: Direction }[];
    inputSequence: { number: number; direction: Direction }[];
    currentStepCount: number;
    currentDirection: Direction | null;
    unlocked: boolean;
  },
  setState: (state: {
    secretCombination: { number: number; direction: Direction }[];
    inputSequence: { number: number; direction: Direction }[];
    currentStepCount: number;
    currentDirection: Direction | null;
    unlocked: boolean;
  }) => void,
  checkCombination: () => void
): (direction: Direction) => void {
  return (direction: Direction): void => {
    const state = getState();
    if (state.unlocked) return;

    const inputSequence = [...state.inputSequence];
    let { currentDirection, currentStepCount } = state;

    if (!currentDirection || currentDirection !== direction) {
      if (currentDirection)
        inputSequence.push({ number: currentStepCount, direction: currentDirection });
      currentDirection = direction;
      currentStepCount = 1;
    } else {
      currentStepCount++;
    }

    setState({
      ...state,
      inputSequence,
      currentDirection,
      currentStepCount
    });

    checkCombination();
  };
}

