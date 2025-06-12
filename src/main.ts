import { Application, Ticker, Text, TextStyle } from 'pixi.js';
import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import { setupSprites } from './setupSprites';
import { initTimer, startTimer } from './timer';
import { generateCombination, resetInput, spinHandleAndReset, checkCombinationFactory } from './combination';


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



    function resizeGame() {
        app.renderer.resize(window.innerWidth, window.innerHeight);
    
        const originalBgWidth = background.texture.width;
        const originalBgHeight = background.texture.height;

        const screenRatio = app.screen.width / app.screen.height;
        const bgRatio = originalBgWidth / originalBgHeight;

        let scaleFactor;

        if (screenRatio > bgRatio) {
            scaleFactor = app.screen.width / originalBgWidth;
        } else {
            scaleFactor = app.screen.height / originalBgHeight;
        }
    
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            console.log('mobile view active');
            scaleFactor *= 0.5; 
        } else {
            console.log('desktop view');
        }

        
        background.width = originalBgWidth * scaleFactor;
        background.height = originalBgHeight * scaleFactor;

        background.x = (app.screen.width - background.width) / 2;
        background.y = (app.screen.height - background.height) / 2;


        blink.scale.set(scaleFactor);
        blink.position.set(app.screen.width / 2 - 50 * scaleFactor, app.screen.height / 2 - 30 * scaleFactor);
        
        door.scale.set(scaleFactor);
        door.position.set(app.screen.width / 2 + 57 * scaleFactor, app.screen.height / 2 - 44 * scaleFactor);

        doorOpen.scale.set(scaleFactor);
        doorOpen.position.set(app.screen.width / 2 + 1475 * scaleFactor, app.screen.height / 2 - 41 * scaleFactor);

        doorOpenShadow.scale.set(scaleFactor);
        doorOpenShadow.position.set(app.screen.width / 2 + 1533 * scaleFactor, app.screen.height / 2 + 45 * scaleFactor);

        const handleScale = scaleFactor * 1.1;
        handle.scale.set(handleScale);
        handle.position.set(app.screen.width / 2 - 33 * scaleFactor, app.screen.height / 2 - 45 * scaleFactor);

        handleShadow.scale.set(handleScale);
        handleShadow.position.set(app.screen.width / 2 - 33 * scaleFactor, app.screen.height / 2 + 5 * scaleFactor);

        timerText.scale.set(scaleFactor);
        timerText.position.set(app.screen.width / 2 - 1180 * scaleFactor, app.screen.height / 2 - 145 * scaleFactor);


    }

  window.addEventListener('resize', resizeGame);
  resizeGame();

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



  function addRotation(direction: Direction): void {
    if (unlocked) return;
    if (!currentDirection || currentDirection !== direction) {
      if (currentDirection) inputSequence.push({ number: currentStepCount, direction: currentDirection });
      currentDirection = direction;
      currentStepCount = 1;
    } else {
      currentStepCount++;
    }
    checkCombination();
  }

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

  

  handle.eventMode = 'static';
  handle.cursor = 'pointer';
  let isRotating = false;

  handle.on('pointerdown', (event: PIXI.FederatedPointerEvent): void => {
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

startGame();