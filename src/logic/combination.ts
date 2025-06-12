import { Application, Text } from 'pixi.js';
import gsap from 'gsap';
import type { Sprite } from 'pixi.js';

export type Direction = 'clockwise' | 'counterclockwise';

export interface CombinationStep {
  number: number;
  direction: Direction;
}

export interface State {
  secretCombination: CombinationStep[];
  inputSequence: CombinationStep[];
  currentStepCount: number;
  currentDirection: Direction | null;
  unlocked: boolean;
}

export interface CombinationContext {
  app: Application;
  gsap: typeof gsap;
  timerText: Text;
  handle: Sprite;
  handleShadow: Sprite;
  door: Sprite;
  doorOpen: Sprite;
  doorOpenShadow: Sprite;
  getState: () => State;
  setState: (state: State) => void;
}

const ROTATION_FULL = Math.PI * 2;
const COMBINATION_LENGTH = 4;
const MAX_COMBINATION_STEP = 9;
const COMBINATION_MIN_STEP = 1;
const DOOR_ANIMATION_DURATION = 0.3;
const HANDLE_ROTATION_DURATION = 1;
const RESET_DELAY_SECONDS = 5;

export function checkCombinationFactory(ctx: CombinationContext) {
  return function checkCombination(): void {
    const state = ctx.getState();
    if (state.unlocked) return;

    const temp: CombinationStep[] = [...state.inputSequence];
    if (state.currentDirection && state.currentStepCount > 0) {
      temp.push({ number: state.currentStepCount, direction: state.currentDirection });
    }

    for (let i = 0; i < temp.length; i++) {
      const entered = temp[i];
      const expected = state.secretCombination[i];
      if (!expected || entered.number > expected.number || entered.direction !== expected.direction) {
        ctx.setState({
          ...state,
          inputSequence: [],
          currentStepCount: 0,
          currentDirection: null
        });
        spinHandleAndReset(ctx);
        return;
      }
    }

    if (
      temp.length === state.secretCombination.length &&
      temp.every((s, i) =>
        s.number === state.secretCombination[i].number &&
        s.direction === state.secretCombination[i].direction
      )
    ) {
      ctx.setState({ ...state, unlocked: true });

      ctx.gsap.to([ctx.door, ctx.handle, ctx.handleShadow], { alpha: 0, duration: DOOR_ANIMATION_DURATION });
      ctx.doorOpen.alpha = 0;
      ctx.doorOpenShadow.alpha = 0;
      ctx.doorOpen.visible = true;
      ctx.doorOpenShadow.visible = true;

      ctx.gsap.to([ctx.doorOpen, ctx.doorOpenShadow], { alpha: 1, duration: DOOR_ANIMATION_DURATION });

      let delayPassed = 0;
      const delayTicker = (): void => {
        delayPassed += ctx.app.ticker.deltaMS / 1000;
        if (delayPassed >= RESET_DELAY_SECONDS) {
          ctx.app.ticker.remove(delayTicker);

          ctx.gsap.to([ctx.doorOpen, ctx.doorOpenShadow], {
            alpha: 0,
            duration: DOOR_ANIMATION_DURATION,
            onComplete: () => {
              ctx.doorOpen.visible = false;
              ctx.doorOpenShadow.visible = false;
              ctx.door.visible = true;
              ctx.handle.visible = true;
              ctx.handleShadow.visible = true;

              ctx.gsap.to([ctx.door, ctx.handle, ctx.handleShadow], { alpha: 1, duration: DOOR_ANIMATION_DURATION });

              ctx.gsap.fromTo(ctx.handle, { rotation: 0 }, {
                rotation: ROTATION_FULL,
                duration: HANDLE_ROTATION_DURATION,
                ease: 'power1.out',
                onUpdate: () => {
                  ctx.handleShadow.rotation = ctx.handle.rotation;
                },
                onComplete: () => {
                  const newState = {
                    ...ctx.getState(),
                    unlocked: false,
                    inputSequence: [],
                    currentDirection: null,
                    currentStepCount: 0,
                    secretCombination: generateCombination(ctx)
                  };
                  ctx.setState(newState);
                }
              });
            }
          });
        }
      };

      ctx.app.ticker.add(delayTicker);
      ctx.timerText.visible = false;
    }
  };
}

export function resetInput(): void {
  
}

export function spinHandleAndReset(ctx: CombinationContext): void {
  const target = ctx.handle.rotation - ROTATION_FULL;

  ctx.gsap.to(ctx.handle, {
    rotation: target,
    duration: HANDLE_ROTATION_DURATION,
    onUpdate: () => {
      ctx.handleShadow.rotation = ctx.handle.rotation;
    },
    onComplete: () => {
      const newState: State = {
        ...ctx.getState(),
        secretCombination: generateCombination(ctx),
        inputSequence: [],
        currentStepCount: 0,
        currentDirection: null,
        unlocked: false
      };
      ctx.setState(newState);
      ctx.door.visible = true;
      ctx.doorOpen.visible = false;
      ctx.doorOpenShadow.visible = false;
    }
  });
}

export function generateCombination(ctx: CombinationContext): CombinationStep[] {
  const combination: CombinationStep[] = [];
  let direction: Direction = Math.random() < 0.5 ? 'clockwise' : 'counterclockwise';

  for (let i = 0; i < COMBINATION_LENGTH; i++) {
    const number = Math.floor(Math.random() * MAX_COMBINATION_STEP) + COMBINATION_MIN_STEP;
    combination.push({ number, direction });
    direction = direction === 'clockwise' ? 'counterclockwise' : 'clockwise';
  }

  console.log('%cSecret combination:', 'color: blue', combination);
  return combination;
}
