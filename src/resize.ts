import { Application, Sprite, Text } from 'pixi.js';

// Constants for layout and scaling
const MOBILE_BREAKPOINT = 768;
const BLINK_OFFSET_X = -50;
const BLINK_OFFSET_Y = -30;
const DOOR_OFFSET_X = 57;
const DOOR_OFFSET_Y = -44;
const DOOR_OPEN_OFFSET_X = 1475;
const DOOR_OPEN_OFFSET_Y = -41;
const DOOR_OPEN_SHADOW_OFFSET_X = 1533;
const DOOR_OPEN_SHADOW_OFFSET_Y = 45;
const HANDLE_OFFSET_X = -33;
const HANDLE_OFFSET_Y = -45;
const HANDLE_SHADOW_OFFSET_Y = 5;
const TIMER_OFFSET_X = -1180;
const TIMER_OFFSET_Y = -145;
const HANDLE_SCALE_MULTIPLIER = 1.1;
const MOBILE_SCALE_REDUCTION = 0.5;

export function setupResize(
  app: Application,
  background: Sprite,
  blink: Sprite,
  door: Sprite,
  doorOpen: Sprite,
  doorOpenShadow: Sprite,
  handle: Sprite,
  handleShadow: Sprite,
  timerText: Text
): void {
  function resizeGame(): void {
    app.renderer.resize(window.innerWidth, window.innerHeight);

    const originalBgWidth = background.texture.width;
    const originalBgHeight = background.texture.height;

    const screenRatio = app.screen.width / app.screen.height;
    const bgRatio = originalBgWidth / originalBgHeight;

    let scaleFactor: number;

    if (screenRatio > bgRatio) {
      scaleFactor = app.screen.width / originalBgWidth;
    } else {
      scaleFactor = app.screen.height / originalBgHeight;
    }

    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    if (isMobile) {
      console.log('mobile view active');
      scaleFactor *= MOBILE_SCALE_REDUCTION;
    } else {
      console.log('desktop view');
    }

    background.width = originalBgWidth * scaleFactor;
    background.height = originalBgHeight * scaleFactor;
    background.x = (app.screen.width - background.width) / 2;
    background.y = (app.screen.height - background.height) / 2;

    blink.scale.set(scaleFactor);
    blink.position.set(app.screen.width / 2 + BLINK_OFFSET_X * scaleFactor, app.screen.height / 2 + BLINK_OFFSET_Y * scaleFactor);

    door.scale.set(scaleFactor);
    door.position.set(app.screen.width / 2 + DOOR_OFFSET_X * scaleFactor, app.screen.height / 2 + DOOR_OFFSET_Y * scaleFactor);

    doorOpen.scale.set(scaleFactor);
    doorOpen.position.set(app.screen.width / 2 + DOOR_OPEN_OFFSET_X * scaleFactor, app.screen.height / 2 + DOOR_OPEN_OFFSET_Y * scaleFactor);

    doorOpenShadow.scale.set(scaleFactor);
    doorOpenShadow.position.set(app.screen.width / 2 + DOOR_OPEN_SHADOW_OFFSET_X * scaleFactor, app.screen.height / 2 + DOOR_OPEN_SHADOW_OFFSET_Y * scaleFactor);

    const handleScale = scaleFactor * HANDLE_SCALE_MULTIPLIER;
    handle.scale.set(handleScale);
    handle.position.set(app.screen.width / 2 + HANDLE_OFFSET_X * scaleFactor, app.screen.height / 2 + HANDLE_OFFSET_Y * scaleFactor);

    handleShadow.scale.set(handleScale);
    handleShadow.position.set(app.screen.width / 2 + HANDLE_OFFSET_X * scaleFactor, app.screen.height / 2 + HANDLE_SHADOW_OFFSET_Y * scaleFactor);

    timerText.scale.set(scaleFactor);
    timerText.position.set(app.screen.width / 2 + TIMER_OFFSET_X * scaleFactor, app.screen.height / 2 + TIMER_OFFSET_Y * scaleFactor);
  }

  window.addEventListener('resize', resizeGame);
  resizeGame();
}