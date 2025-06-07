import { Application, Assets, Sprite, Ticker, Text, TextStyle } from 'pixi.js';

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
    // const blinkTexture = await Assets.load('./assets/blink.png');

  
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
  

    app.stage.addChild(background);
    app.stage.addChild(door);
    app.stage.addChild(doorOpenShadow);
    app.stage.addChild(doorOpen);
    app.stage.addChild(handleShadow);
    app.stage.addChild(handle);

    //=======TESTING=======
    function resizeBackground() {
      const bgRatio = background.texture.width / background.texture.height;
      const screenRatio = app.screen.width / app.screen.height;

      if (screenRatio > bgRatio) {
        background.width = app.screen.width;
        background.height = app.screen.width / bgRatio;
      } else {
        background.height = app.screen.height;
        background.width = app.screen.height * bgRatio;
      }

      background.x = (app.screen.width - background.width) / 2;
      background.y = (app.screen.height - background.height) / 2;
    }
    //=======TESTING=======
    
    
    
    

    const timerStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 55,
      fill: '#ff0000',
      stroke: '#000000',
      align: 'center',
    });

    const timerText = new Text('30', timerStyle);
    timerText.anchor.set(0.5);
timerText.x = app.screen.width / 3 - 45;  
timerText.y = app.screen.height / 2 - 36;
    app.stage.addChild(timerText);

    let countdownInterval: ReturnType<typeof setInterval> | null = null;

function startTimer(seconds: number) {
    if (countdownInterval) clearInterval(countdownInterval);

    let timePassed = 0;
    timerText.text = timePassed.toString();
    timerText.visible = true;

    countdownInterval = setInterval(() => {
        timePassed++;
        timerText.text = timePassed.toString();

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

    timerText
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

        const rotate = (ticker: Ticker) => {
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
        };

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

     
        startTimer(30);

        codeResetTimer = setTimeout(() => {

            console.log('%cTime is up! Generating a new code.', 'color: orange');
            secretCombination = generateCombination();
            inputSequence = [];
            currentStepCount = 0;
            currentDirection = null;
            unlocked = false;
        }, 30000);

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
    let idleTimeout: ReturnType<typeof setTimeout> | null = null;

    function resetIdleTimeout() {
        if (idleTimeout) clearTimeout(idleTimeout);
        idleTimeout = setTimeout(() => {
            console.log('No rotation detected for 2 seconds — finalizing last step');
            finalizeLastStepAndCheck();
        }, 2000);
    }

    function addRotation(direction: Direction) {
        console.log('%cTurned 60° ' + direction, 'color: lightblue');

        if (unlocked) return;

        resetIdleTimeout();

        if (direction !== currentDirection) {
            if (inputSequence.length === 2) {
                const firstDirection = secretCombination[0].direction;
                const secondDirection = secretCombination[1].direction;

                if (firstDirection === secondDirection && direction === firstDirection) {
                    console.log('%cInvalid direction: cannot have 3 steps in same direction', 'color: orange');
                    resetInput();
                    return;
                }
            }

            if (currentDirection && currentStepCount > 0) {
                inputSequence.push({ number: currentStepCount, direction: currentDirection });
                console.log('Step added:', { number: currentStepCount, direction: currentDirection });
            }

            currentDirection = direction;
            currentStepCount = 1;
        } else {
            currentStepCount++;
        }
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

    function finalizeLastStepAndCheck() {
        if (unlocked) return;

        if (currentDirection && currentStepCount > 0 && inputSequence.length === 2) {
            inputSequence.push({ number: currentStepCount, direction: currentDirection });
            console.log('Final step added:', { number: currentStepCount, direction: currentDirection });

            checkCombination();
        }
    }

    function spinHandleAndReset() {
        let rotation = 0;
        const fullRotation = -Math.PI * 2;
        const speed = 0.2;

        const spin = (ticker: Ticker) => {
            const step = speed * ticker.deltaTime;
            if (rotation - step <= fullRotation) {
                const remaining = fullRotation - rotation;
                handle.rotation += remaining;
                handleShadow.rotation += remaining;
                app.ticker.remove(spin);

                secretCombination = generateCombination();
                inputSequence = [];
                currentDirection = null;
                currentStepCount = 0;
                unlocked = false;

                door.visible = true;
                doorOpen.visible = false;
                doorOpenShadow.visible = false;

                return;
            }
            handle.rotation -= step;
            handleShadow.rotation -= step;
            rotation -= step;
        };

        app.ticker.add(spin);
    }

    function checkCombination() {
    if (unlocked) return;

    console.log('%cEntered combination:', 'color: cyan', inputSequence);
    console.log('%cExpected combination:', 'color: yellow', secretCombination);

    const match = inputSequence.every((step, i) =>
        step.number === secretCombination[i].number &&
        step.direction === secretCombination[i].direction
    );

    if (match) {
        console.log('%cUnlocked! 🎉', 'color: lime');
        unlocked = true;
        door.visible = false;
        handle.visible = false;
        handleShadow.visible = false;
        doorOpen.visible = true;
        doorOpenShadow.visible = true;

        setTimeout(() => {
           
            doorOpen.visible = false;
            doorOpenShadow.visible = false;

            
            door.visible = true;
            handle.visible = true;
            handleShadow.visible = true;

            
            let rotation = 0;
            const fullRotation = Math.PI * 2;  
            const speed = 0.15;

            const rotateHandle = (ticker: Ticker) => {
                const step = speed * ticker.deltaTime;
                rotation += step;

                handle.rotation += step;
                handleShadow.rotation += step;

                if (rotation >= fullRotation) {
                    app.ticker.remove(rotateHandle);

                    
                    unlocked = false;
                    inputSequence = [];
                    currentDirection = null;
                    currentStepCount = 0;

                    secretCombination = generateCombination();

                    if (codeResetTimer) {
                        clearTimeout(codeResetTimer);
                        codeResetTimer = null;
                    }
                }
            };

            app.ticker.add(rotateHandle);

        }, 5000);

        
        timerText.visible = false;
        if (countdownInterval) clearInterval(countdownInterval);
    } else {
        console.log('%cWrong combination. Spinning left and resetting...', 'color: red');
        spinHandleAndReset();
    }
}

})();
