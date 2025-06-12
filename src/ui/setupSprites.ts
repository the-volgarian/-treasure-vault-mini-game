import { Application, Assets, Sprite, Texture } from 'pixi.js';

const CENTER_OFFSET_X = 15;
const CENTER_OFFSET_Y = -14;
const DOOR_OPEN_OFFSET_X = 450;
const DOOR_OPEN_SHADOW_OFFSET_X = 460;
const DOOR_OPEN_SHADOW_OFFSET_Y = 10;
const HANDLE_OFFSET_X = -8;
const HANDLE_SHADOW_OFFSET_Y = -3;
const BLINK_SCALE_RATIO = 0.32;
const DOOR_SCALE_RATIO = 0.32;
const HANDLE_SCALE_RATIO = 0.12;

export interface VaultSprites {
  background: Sprite;
  door: Sprite;
  doorOpen: Sprite;
  doorOpenShadow: Sprite;
  handle: Sprite;
  handleShadow: Sprite;
  blink: Sprite;
}

export async function setupSprites(app: Application): Promise<VaultSprites> {
  const [
    bgTexture,
    vaultTexture,
    handleTexture,
    handleShadowTexture,
    doorOpenTexture,
    doorOpenShadowTexture,
    blinkTexture
  ]: Texture[] = await Promise.all([
    Assets.load('./assets/bg.png'),
    Assets.load('./assets/door.png'),
    Assets.load('./assets/handle.png'),
    Assets.load('./assets/handleShadow.png'),
    Assets.load('./assets/doorOpen.png'),
    Assets.load('./assets/doorOpenShadow.png'),
    Assets.load('./assets/blink.png')
  ]);

  const background = new Sprite(bgTexture);
  background.width = app.screen.width;
  background.height = app.screen.height;

  const door = new Sprite(vaultTexture);
  door.anchor.set(0.5);
  door.x = app.screen.width / 2 + CENTER_OFFSET_X;
  door.y = app.screen.height / 2 + CENTER_OFFSET_Y;
  door.width = app.screen.width * DOOR_SCALE_RATIO;
  door.height = door.width * (vaultTexture.height / vaultTexture.width);

  const doorOpen = new Sprite(doorOpenTexture);
  doorOpen.anchor.set(0.5);
  doorOpen.x = app.screen.width / 2 + DOOR_OPEN_OFFSET_X;
  doorOpen.y = app.screen.height / 2 + CENTER_OFFSET_Y;
  doorOpen.width = app.screen.width * DOOR_SCALE_RATIO;
  doorOpen.height = doorOpen.width * (doorOpenTexture.height / doorOpenTexture.width);

  const doorOpenShadow = new Sprite(doorOpenShadowTexture);
  doorOpenShadow.anchor.set(0.5);
  doorOpenShadow.x = app.screen.width / 2 + DOOR_OPEN_SHADOW_OFFSET_X;
  doorOpenShadow.y = app.screen.height / 2 + DOOR_OPEN_SHADOW_OFFSET_Y;
  doorOpenShadow.width = app.screen.width * DOOR_SCALE_RATIO;
  doorOpenShadow.height = doorOpenShadow.width * (doorOpenShadowTexture.height / doorOpenShadowTexture.width);

  const handle = new Sprite(handleTexture);
  handle.anchor.set(0.5);
  handle.x = app.screen.width / 2 + HANDLE_OFFSET_X;
  handle.y = app.screen.height / 2 + CENTER_OFFSET_Y;
  handle.width = app.screen.width * HANDLE_SCALE_RATIO;
  handle.height = handle.width * (handleTexture.height / handleTexture.width);

  const handleShadow = new Sprite(handleShadowTexture);
  handleShadow.anchor.set(0.5);
  handleShadow.x = app.screen.width / 2 + HANDLE_OFFSET_X;
  handleShadow.y = app.screen.height / 2 + HANDLE_SHADOW_OFFSET_Y;
  handleShadow.width = app.screen.width * HANDLE_SCALE_RATIO;
  handleShadow.height = handleShadow.width * (handleShadowTexture.height / handleShadowTexture.width);

  const blink = new Sprite(blinkTexture);
  blink.anchor.set(0.5);
  blink.x = app.screen.width / 2 + CENTER_OFFSET_X;
  blink.y = app.screen.height / 2 + CENTER_OFFSET_Y;
  blink.width = app.screen.width * BLINK_SCALE_RATIO;
  blink.height = blink.width * (blinkTexture.height / blinkTexture.width);

  return { background, door, doorOpen, doorOpenShadow, handle, handleShadow, blink };
}
