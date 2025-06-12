import { Application} from 'pixi.js';
import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import { setupSprites } from '../ui/setupSprites';
import { initTimer, startTimer } from '../ui/timer';
import { generateCombination, checkCombinationFactory } from '../logic/combination';
import { setupResize } from '../ui/resize';
import { createAddRotation, setupHandleInteraction } from '../logic/rotation';
import type { State } from '../logic/combination';
import type { CombinationState } from '../logic/rotation';

const BLINK_SCALE_X = 1.1;
const BLINK_SCALE_Y = 1.1;
const BLINK_ANIMATION_DURATION = 0.8;
const BLINK_ANIMATION_EASE = "sine.inOut";
const BLINK_REPEAT = -1;
const BACKGROUND_COLOR = '#000000';

async function startGame(): Promise<void> {
  const app = new Application();
  await app.init({ resizeTo: window, background: BACKGROUND_COLOR });
  document.body.appendChild(app.canvas);

  const { background, door, doorOpen, doorOpenShadow, handle, handleShadow, blink } = await setupSprites(app);

  const setupScene = (sprites: { [key: string]: PIXI.Sprite }) => {
    Object.values(sprites).forEach(sprite => app.stage.addChild(sprite));
  };
  setupScene({ background, blink, door, doorOpenShadow, doorOpen, handleShadow, handle });

  doorOpen.visible = false;
  doorOpenShadow.visible = false;
  door.visible = true;

  gsap.to(blink.scale, {
    x: BLINK_SCALE_X,
    y: BLINK_SCALE_Y,
    duration: BLINK_ANIMATION_DURATION,
    ease: BLINK_ANIMATION_EASE,
    yoyo: true,
    repeat: BLINK_REPEAT
  });

  const timerText = initTimer(app);
  setupResize(app, background, blink, door, doorOpen, doorOpenShadow, handle, handleShadow, timerText);

  type Direction = 'clockwise' | 'counterclockwise';
  interface CombinationStep {
    number: number;
    direction: Direction;
  }

  let secretCombination: CombinationStep[] = [];
  let inputSequence: CombinationStep[] = [];
  let currentStepCount = 0;
  let currentDirection: Direction | null = null;
  let unlocked = false;

  const combinationContext = {
    app,
    gsap,
    timerText,
    handle,
    handleShadow,
    door,
    doorOpen,
    doorOpenShadow,
    getState: (): State => ({
      secretCombination,
      inputSequence,
      currentStepCount,
      currentDirection,
      unlocked
    }),
    setState: (newState: CombinationState): void => {
      secretCombination = newState.secretCombination;
      inputSequence = newState.inputSequence;
      currentStepCount = newState.currentStepCount;
      currentDirection = newState.currentDirection;
      unlocked = newState.unlocked;
    }
  };

  secretCombination = generateCombination(combinationContext);
  startTimer(app, timerText, () => {
    secretCombination = generateCombination(combinationContext);
  });

  const checkCombination = checkCombinationFactory(combinationContext);

  const addRotation = createAddRotation(
    combinationContext.getState,
    combinationContext.setState,
    checkCombination
  );

  setupHandleInteraction(app, handle, handleShadow, addRotation);
}

startGame();
