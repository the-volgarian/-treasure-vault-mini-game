 import { Application, Assets, Sprite } from 'pixi.js';

export async function setupSprites(app: Application) {
  const [
    bgTexture, vaultTexture, handleTexture, handleShadowTexture,
    doorOpenTexture, doorOpenShadowTexture, blinkTexture
  ] = await Promise.all([
    Assets.load('./assets/bg.png'),
    Assets.load('./assets/door.png'),
    Assets.load('./assets/handle.png'),
    Assets.load('./assets/handleShadow.png'),
    Assets.load('./assets/doorOpen.png'),
    Assets.load('./assets/doorOpenShadow.png'),
    Assets.load('./assets/blink.png')
  ]);

  const background = new Sprite(bgTexture);
  const door = new Sprite(vaultTexture);
  const doorOpen = new Sprite(doorOpenTexture);
  const doorOpenShadow = new Sprite(doorOpenShadowTexture);
  const handle = new Sprite(handleTexture);
  const handleShadow = new Sprite(handleShadowTexture);
  const blink = new Sprite(blinkTexture);

  blink.anchor.set(0.5);
  blink.x = app.screen.width / 2 + 15;
  blink.y = app.screen.height / 2 - 14;
  blink.width = app.screen.width * 0.32;
  blink.height = blink.width * (blinkTexture.height / blinkTexture.width);

  door.anchor.set(0.5);
  door.x = app.screen.width / 2 + 15;
  door.y = app.screen.height / 2 - 14;
  door.width = app.screen.width * 0.32;
  door.height = door.width * (vaultTexture.height / vaultTexture.width);

  doorOpen.anchor.set(0.5);
  doorOpen.x = app.screen.width / 2 + 450;
  doorOpen.y = app.screen.height / 2 - 14;
  doorOpen.width = app.screen.width * 0.32;
  doorOpen.height = doorOpen.width * (doorOpenTexture.height / doorOpenTexture.width);

  doorOpenShadow.anchor.set(0.5);
  doorOpenShadow.x = app.screen.width / 2 + 460;
  doorOpenShadow.y = app.screen.height / 2 + 10;
  doorOpenShadow.width = app.screen.width * 0.32;
  doorOpenShadow.height = doorOpenShadow.width * (doorOpenShadowTexture.height / doorOpenShadowTexture.width);

  handle.anchor.set(0.5);
  handle.x = app.screen.width / 2 - 8;
  handle.y = app.screen.height / 2 - 14;
  handle.width = app.screen.width * 0.12;
  handle.height = handle.width * (handleTexture.height / handleTexture.width);

  handleShadow.anchor.set(0.5);
  handleShadow.x = app.screen.width / 2 - 8;
  handleShadow.y = app.screen.height / 2 - 3;
  handleShadow.width = app.screen.width * 0.12;
  handleShadow.height = handleShadow.width * (handleShadowTexture.height / handleShadowTexture.width);

  background.width = app.screen.width;
  background.height = app.screen.height;

  return { background, door, doorOpen, doorOpenShadow, handle, handleShadow, blink };
}