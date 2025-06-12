import { Application, Ticker, Text, TextStyle } from 'pixi.js';
import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import { setupSprites } from './setupSprites';
import { initTimer, startTimer } from './timer';
import { generateCombination, resetInput, spinHandleAndReset, checkCombinationFactory } from './combination';
import { setupResize } from './resize';
import { createAddRotation, setupHandleInteraction } from './rotation';


async function startGame(): Promise<void> {
  const app = new Application();
  await app.init({ resizeTo: window, background: '#000000' });
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
    x: 1.1,
    y: 1.1,
    duration: 0.8,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1
  });

  
  const timerText = initTimer(app);
  setupResize(app, background, blink, door, doorOpen, doorOpenShadow, handle, handleShadow, timerText);


    
  type Direction = 'clockwise' | 'counterclockwise';
  interface CombinationStep {
    number: number;
    direction: Direction;
  }

  const COMBINATION_LENGTH = 4;

  let secretCombination: CombinationStep[] = [];
  let inputSequence: CombinationStep[] = [];
  let currentStepCount = 0;
  let currentDirection: Direction | null = null;
  let unlocked = false;

  type CombinationContext = {
  app: Application;
  gsap: typeof gsap;
  timerText: PIXI.Text;
  handle: PIXI.Sprite;
  handleShadow: PIXI.Sprite;
  door: PIXI.Sprite;
  doorOpen: PIXI.Sprite;
  doorOpenShadow: PIXI.Sprite;
  getState: () => {
    secretCombination: CombinationStep[];
    inputSequence: CombinationStep[];
    currentStepCount: number;
    currentDirection: Direction | null;
    unlocked: boolean;
  };
  setState: (newState: {
    secretCombination: CombinationStep[];
    inputSequence: CombinationStep[];
    currentStepCount: number;
    currentDirection: Direction | null;
    unlocked: boolean;
  }) => void;
};

const combinationContext: CombinationContext = {
  app,
  gsap,
  timerText,
  handle,
  handleShadow,
  door,
  doorOpen,
  doorOpenShadow,
  getState: () => ({
    secretCombination,
    inputSequence,
    currentStepCount,
    currentDirection,
    unlocked
  }),
  setState: (newState) => {
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



  

  const checkCombination = checkCombinationFactory({
    app,
    gsap,
    timerText,
    handle,
    handleShadow,
    door,
    doorOpen,
    doorOpenShadow,
    getState: () => ({
      secretCombination,
      inputSequence,
      currentStepCount,
      currentDirection,
      unlocked
    }),
    setState: (newState) => {
      secretCombination = newState.secretCombination;
      inputSequence = newState.inputSequence;
      currentStepCount = newState.currentStepCount;
      currentDirection = newState.currentDirection;
      unlocked = newState.unlocked;
    }
  });

const addRotation = createAddRotation(
  combinationContext.getState,
  combinationContext.setState,
  checkCombination
);

  

setupHandleInteraction(app, handle, handleShadow, addRotation);

}

startGame();