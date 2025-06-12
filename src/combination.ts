import { Application, Text } from 'pixi.js';
import gsap from 'gsap';
import type { Sprite, Ticker } from 'pixi.js';

export type Direction = 'clockwise' | 'counterclockwise';

export interface CombinationStep {
  number: number;
  direction: Direction;
}

interface State {
  secretCombination: CombinationStep[];
  inputSequence: CombinationStep[];
  currentStepCount: number;
  currentDirection: Direction | null;
  unlocked: boolean;
}

interface CombinationContext {
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

      ctx.gsap.to([ctx.door, ctx.handle, ctx.handleShadow], { alpha: 0, duration: 0.3 });
      ctx.doorOpen.alpha = 0;
      ctx.doorOpenShadow.alpha = 0;
      ctx.doorOpen.visible = true;
      ctx.doorOpenShadow.visible = true;

      ctx.gsap.to([ctx.doorOpen, ctx.doorOpenShadow], { alpha: 1, duration: 0.3 });

      let delayPassed = 0;
      const delayDuration = 5;

      const delayTicker = (ticker: Ticker): void => {
        delayPassed += ticker.deltaMS / 1000;
        if (delayPassed >= delayDuration) {
          ctx.app.ticker.remove(delayTicker);

          ctx.gsap.to([ctx.doorOpen, ctx.doorOpenShadow], {
            alpha: 0,
            duration: 0.3,
            onComplete: () => {
              ctx.doorOpen.visible = false;
              ctx.doorOpenShadow.visible = false;
              ctx.door.visible = true;
              ctx.handle.visible = true;
              ctx.handleShadow.visible = true;

              ctx.gsap.to([ctx.door, ctx.handle, ctx.handleShadow], { alpha: 1, duration: 0.3 });

              ctx.gsap.fromTo(ctx.handle, { rotation: 0 }, {
                rotation: Math.PI * 2,
                duration: 1,
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
  //////////////////emty////////////////////////
}

export function spinHandleAndReset(ctx: CombinationContext): void {
  const target = ctx.handle.rotation - Math.PI * 2;

  ctx.gsap.to(ctx.handle, {
    rotation: target,
    duration: 1,
    onUpdate: () => {
      ctx.handleShadow.rotation = ctx.handle.rotation;
    },
    onComplete: () => {
      const newState = {
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
  const length = 4;
  let direction: Direction = Math.random() < 0.5 ? 'clockwise' : 'counterclockwise';

  for (let i = 0; i < length; i++) {
    const number = Math.floor(Math.random() * 9) + 1;
    combination.push({ number, direction });
    direction = direction === 'clockwise' ? 'counterclockwise' : 'clockwise';
  }

  console.log('%cSecret combination:', 'color: blue', combination);
  return combination;
}
