import { Application, Sprite, Text } from 'pixi.js';

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
}
