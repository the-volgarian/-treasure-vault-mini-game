import { Application, Ticker, Text, TextStyle } from 'pixi.js';
import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import { setupSprites } from './setupSprites';
import { initTimer, startTimer } from './timer';


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

  function generateCombination(): CombinationStep[] {
      startTimer(app, timerText, () => {
      secretCombination = generateCombination();
      inputSequence = [];
      currentStepCount = 0;
      currentDirection = null;
      unlocked = false;
    });
    const combination: CombinationStep[] = [];
    let direction: Direction = Math.random() < 0.5 ? 'clockwise' : 'counterclockwise';
    for (let i = 0; i < COMBINATION_LENGTH; i++) {
      const number = Math.floor(Math.random() * 9) + 1;
      combination.push({ number, direction });
      direction = direction === 'clockwise' ? 'counterclockwise' : 'clockwise';
    }
    console.log('%cSecret combination:', 'color: blue', combination);
    return combination;
  }
  secretCombination = generateCombination();

  function resetInput(): void {
    inputSequence = [];
    currentDirection = null;
    currentStepCount = 0;
  }

  function spinHandleAndReset(): void {
    const target = handle.rotation - Math.PI * 2;
    gsap.to(handle, {
      rotation: target,
      duration: 1,
      onUpdate: () => { handleShadow.rotation = handle.rotation; },
      onComplete: () => {
        secretCombination = generateCombination();
        resetInput();
        unlocked = false;
        door.visible = true;
        doorOpen.visible = false;
        doorOpenShadow.visible = false;
      }
    });
  }

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

  function checkCombination(): void {
    if (unlocked) return;
    const temp: CombinationStep[] = [...inputSequence];
    if (currentDirection && currentStepCount > 0) temp.push({ number: currentStepCount, direction: currentDirection });
    for (let i = 0; i < temp.length; i++) {
      const entered = temp[i], expected = secretCombination[i];
      if (!expected || entered.number > expected.number || entered.direction !== expected.direction) {
        resetInput();
        spinHandleAndReset();
        return;
      }
    }
    if (temp.length === secretCombination.length && temp.every((s, i) => s.number === secretCombination[i].number && s.direction === secretCombination[i].direction)) {
      unlocked = true;
      gsap.to([door, handle, handleShadow], { alpha: 0, duration: 0.3 });
      doorOpen.alpha = 0;
      doorOpenShadow.alpha = 0;
      doorOpen.visible = true;
      doorOpenShadow.visible = true;
      gsap.to([doorOpen, doorOpenShadow], { alpha: 1, duration: 0.3 });
      let delayPassed = 0;
      const delayDuration = 5;

      const delayTicker = (ticker: Ticker): void => {
        delayPassed += ticker.deltaMS / 1000;
        if (delayPassed >= delayDuration) {
          app.ticker.remove(delayTicker);

          gsap.to([doorOpen, doorOpenShadow], {
            alpha: 0,
            duration: 0.3,
            onComplete: () => {
              doorOpen.visible = false;
              doorOpenShadow.visible = false;
              door.visible = true;
              handle.visible = true;
              handleShadow.visible = true;
              gsap.to([door, handle, handleShadow], { alpha: 1, duration: 0.3 });
              gsap.fromTo(handle, { rotation: 0 }, {
                rotation: Math.PI * 2,
                duration: 1,
                ease: 'power1.out',
                onUpdate: () =>{handleShadow.rotation = handle.rotation},
                onComplete: () => {
                  unlocked = false;
                  resetInput();
                  secretCombination = generateCombination();
                }
              });
            }
          });
        }
      };
      app.ticker.add(delayTicker);
      timerText.visible = false;
    }
  }

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