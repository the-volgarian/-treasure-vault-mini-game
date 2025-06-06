import { Application, Assets, Sprite } from 'pixi.js';

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
    doorOpen.height = door.width * (vaultTexture.height / vaultTexture.width);

    const doorOpenShadow = new Sprite(doorOpenShadowTexture);
    doorOpenShadow.anchor.set(0.5);
    doorOpenShadow.x = app.screen.width / 2 + 460;
    doorOpenShadow.y = app.screen.height / 2 + 10;
    doorOpenShadow.width = app.screen.width * 0.32;
    doorOpenShadow.height = door.width * (vaultTexture.height / vaultTexture.width);

    const handle = new Sprite(handleTexture);
    handle.anchor.set(0.5);
    handle.x = app.screen.width / 2 - 8;
    handle.y = app.screen.height / 2 - 14;
    handle.width = app.screen.width * 0.12;
    handle.height = app.screen.height * 0.27;

    const handleShadow = new Sprite(handleShadowTexture);
    handleShadow.anchor.set(0.5);
    handleShadow.x = app.screen.width / 2 - 8;
    handleShadow.y = app.screen.height / 2 - 3;
    handleShadow.width = app.screen.width * 0.12;
    handleShadow.height = app.screen.height * 0.27;

    const background = new Sprite(texture);
    background.width = app.screen.width;
    background.height = app.screen.height;

    app.stage.addChild(background);
    app.stage.addChild(door);
    app.stage.addChild(doorOpenShadow);
    app.stage.addChild(doorOpen);
    app.stage.addChild(handleShadow);
    app.stage.addChild(handle);

})();
