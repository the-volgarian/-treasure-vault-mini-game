import { Application, Assets, Sprite, Ticker, Text, TextStyle} from 'pixi.js';
import * as PIXI from 'pixi.js';
import gsap from 'gsap';



(async () => {
    const app = new Application();

    await app.init({
        resizeTo: window,
        background: '#000000',
    });

    document.body.appendChild(app.canvas);

  
    const texture = await Assets.load('./assets/bg.png');
    const vaultTexture = await Assets.load('./assets/door.png');
    const handleTexture = await Assets.load('./assets/handle.png');
    const handleShadowTexture = await Assets.load('./assets/handleShadow.png');
    const doorOpenTexture = await Assets.load('./assets/doorOpen.png');
    const doorOpenShadowTexture = await Assets.load('./assets/doorOpenShadow.png');
    const blinkTexture = await Assets.load('./assets/blink.png');

    const blink = new Sprite(blinkTexture);
    blink.anchor.set(0.5);
    blink.x = app.screen.width / 2 + 15;
    blink.y = app.screen.height / 2 - 14;
    blink.width = app.screen.width * 0.32;
    blink.height = blink.width * (blinkTexture.height / blinkTexture.width);

    const door = new Sprite(vaultTexture);
    door.anchor.set(0.5);
    door.x = app.screen.width / 2 + 15;
    door.y = app.screen.height / 2 - 14;
    door.width = app.screen.width * 0.32;
    door.height = door.width * (vaultTexture.height / vaultTexture.width);

    const doorOpen = new Sprite(doorOpenTexture);
    doorOpen.anchor.set(0.5);
    doorOpen.x = app.screen.width / 2 + 450;
    doorOpen.y = app.screen.height / 2 - 14;
    doorOpen.width = app.screen.width * 0.32;
    doorOpen.height = doorOpen.width * (doorOpenTexture.height / doorOpenTexture.width);

    const doorOpenShadow = new Sprite(doorOpenShadowTexture);
    doorOpenShadow.anchor.set(0.5);
    doorOpenShadow.x = app.screen.width / 2 + 460;
    doorOpenShadow.y = app.screen.height / 2 + 10;
    doorOpenShadow.width = app.screen.width * 0.32;
    doorOpenShadow.height = doorOpenShadow.width * (doorOpenShadowTexture.height / doorOpenShadowTexture.width);

    const handle = new Sprite(handleTexture);
    handle.anchor.set(0.5);
    handle.x = app.screen.width / 2 - 8;
    handle.y = app.screen.height / 2 - 14;
    handle.width = app.screen.width * 0.12;
    handle.height = app.screen.height * 0.32;
    handle.height = handle.width * (handleTexture.height / handleTexture.width);

    const handleShadow = new Sprite(handleShadowTexture);
    handleShadow.anchor.set(0.5);
    handleShadow.x = app.screen.width / 2 - 8;
    handleShadow.y = app.screen.height / 2 - 3;
    handleShadow.width = app.screen.width * 0.12;
    handleShadow.height = app.screen.height * 0.32;
    handleShadow.height = handleShadow.width * (handleShadowTexture.height / handleShadowTexture.width);

    const background = new Sprite(texture);
    background.width = app.screen.width;
    background.height = app.screen.height;
  
    function setupScene(sprites: { [key: string]: PIXI.Sprite }) {
        for (const key in sprites) {
            app.stage.addChild(sprites[key]);
        }
    }

    setupScene({background, blink, door, doorOpenShadow, doorOpen, handleShadow, handle})


    gsap.to(blink.scale, {
        x: 1.1,
        y: 1.1,
        duration: 0.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
    });


    const timerStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 55,
      fill: '#ff0000',
      stroke: '#000000',
      align: 'center',
    });

    const timerText = new Text('10000000', timerStyle);
    timerText.anchor.set(0.5);
    timerText.x = app.screen.width / 3 - 45;  
    timerText.y = app.screen.height / 2 - 36;
    app.stage.addChild(timerText);

    let countdownInterval: ReturnType<typeof setInterval> | null = null;

    function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function startTimer(seconds: number) {
    if (countdownInterval) clearInterval(countdownInterval);

    let timePassed = 0;
    timerText.text = formatTime(timePassed);
    timerText.visible = true;

    countdownInterval = setInterval(() => {
        timePassed++;
        timerText.text = formatTime(timePassed);

        if (timePassed >= seconds) {
            if (countdownInterval) clearInterval(countdownInterval);
            timerText.visible = false;

            console.log('%cTime is up! Generating a new code.', 'color: orange');
            secretCombination = generateCombination();
            inputSequence = [];
            currentStepCount = 0;
            currentDirection = null;
            unlocked = false;
        }
    }, 1000);
}


    

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
 
   
   
    doorOpen.visible = false;
    doorOpenShadow.visible = false;

    handle.eventMode = 'static';
    handle.cursor = 'pointer';

    let isRotating = false;

    handle.on('pointerdown', (event) => {
    if (isRotating) return;

    const clickPos = event.data.global;
    const direction = clickPos.x > handle.x ? 1 : -1;
    const rotationTarget = (Math.PI / 3) * direction;

    isRotating = true;
    let rotated = 0;

    function rotate(ticker: Ticker) {
        const step = 0.05 * ticker.deltaTime * direction;
        if (Math.abs(rotated + step) >= Math.abs(rotationTarget)) {
            const remaining = rotationTarget - rotated;
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
    }

    app.ticker.add(rotate);
});

    type Direction = 'clockwise' | 'counterclockwise';

    interface CombinationStep {
        number: number;
        direction: Direction;
    }

    let codeResetTimer: ReturnType<typeof setTimeout> | null = null;

    

    function generateCombination(): CombinationStep[] {
        if (codeResetTimer) clearTimeout(codeResetTimer);

     
        startTimer(100000000);


        const directionsPattern1: Direction[] = ['counterclockwise', 'clockwise', 'counterclockwise'];
        const directionsPattern2: Direction[] = ['clockwise', 'counterclockwise', 'clockwise'];
        const chosenPattern = Math.random() < 0.5 ? directionsPattern1 : directionsPattern2;

        const combination: CombinationStep[] = [];
        for (let i = 0; i < 3; i++) {
            const number = Math.floor(Math.random() * 9) + 1;
            combination.push({ number, direction: chosenPattern[i] });
        }

        console.log('%cSecret combination:', 'color: blue', combination);
        return combination;
    }

    let secretCombination = generateCombination();
    let inputSequence: CombinationStep[] = [];
    let currentStepCount = 0;
    let currentDirection: Direction | null = null;
    let unlocked = false;
    let thirdStepTimer: ReturnType<typeof setTimeout> | null = null;



function addRotation(direction: 'clockwise' | 'counterclockwise') {
    if (unlocked) return;

    if (currentDirection === null || currentDirection !== direction) {
        if (currentDirection !== null) {
            inputSequence.push({ number: currentStepCount, direction: currentDirection });
            console.log('Added step:', { number: currentStepCount, direction: currentDirection });
        }

        currentDirection = direction;
        currentStepCount = 1;
    } else {
        currentStepCount++;
    }

    checkCombination();
}

    function resetInput() {
        console.log('%cResetting input due to invalid direction sequence.', 'color: red');
        inputSequence = [];
        currentDirection = null;
        currentStepCount = 0;
        if (thirdStepTimer) {
            clearTimeout(thirdStepTimer);
            thirdStepTimer = null;
        }
    }

function spinHandleAndReset() {
    const targetRotation = handle.rotation - Math.PI * 2;

    gsap.to(handle, {
        rotation: targetRotation,
        duration: 1,
        ease: 'power2.inOut',
        onUpdate: () => {
            handleShadow.rotation = handle.rotation;
        },
        onComplete: () => {
            secretCombination = generateCombination();
            inputSequence = [];
            currentDirection = null;
            currentStepCount = 0;
            unlocked = false;

            door.visible = true;
            doorOpen.visible = false;
            doorOpenShadow.visible = false;
        }
    });
}


function checkCombination() {
    if (unlocked) return;

    if (inputSequence.length === 0 && currentDirection === null) return;

    const tempSequence = [...inputSequence];
    if (currentDirection !== null && currentStepCount > 0) {
        tempSequence.push({ number: currentStepCount, direction: currentDirection });
    }

    console.log('%cEntered combination:', 'color: cyan', tempSequence);
    console.log('%cExpected combination:', 'color: yellow', secretCombination);

    for (let i = 0; i < tempSequence.length; i++) {
        const enteredStep = tempSequence[i];
        const expectedStep = secretCombination[i];

        if (
            !expectedStep || 
            enteredStep.number > expectedStep.number || 
            enteredStep.direction !== expectedStep.direction
        ) {
            console.log('%cInvalid prefix detected, resetting...', 'color: red');
            resetInput();
            spinHandleAndReset();
            return;
        }
    }

    if (tempSequence.length === secretCombination.length) {
        const isExactMatch = tempSequence.every((step, i) =>
            step.number === secretCombination[i].number &&
            step.direction === secretCombination[i].direction
        );

        if (isExactMatch) {
    unlocked = true;

    gsap.to([door, handle, handleShadow], { alpha: 0, duration: 0.3 });

    doorOpen.alpha = 0;
    doorOpenShadow.alpha = 0;
    doorOpen.visible = true;
    doorOpenShadow.visible = true;

    gsap.to([doorOpen, doorOpenShadow], { alpha: 1, duration: 0.3 });

    setTimeout(() => {
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

                gsap.fromTo(handle, 
                    { rotation: 0 }, 
                    { 
                        rotation: Math.PI * 2, 
                        duration: 1, 
                        ease: 'power1.out',
                        onUpdate: () => { handleShadow.rotation = handle.rotation },
                        onComplete: () => {
                            unlocked = false;
                            inputSequence = [];
                            currentDirection = null;
                            currentStepCount = 0;
                            secretCombination = generateCombination();
                        }
                    });
            }
        });
    }, 5000);
            timerText.visible = false;
            if (countdownInterval) clearInterval(countdownInterval);
        }
    }
}


})();
