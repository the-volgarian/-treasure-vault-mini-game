import { Application, Text, TextStyle } from 'pixi.js';

export function initTimer(app: Application): Text {
  const timerText = new Text('00:00', new TextStyle({
    fontFamily: 'Arial',
    fontSize: 55,
    fill: '#ff0000',
    stroke: '#000000',
    align: 'center',
  }));

  timerText.anchor.set(0.5);
  timerText.x = app.screen.width / 3 - 45;
  timerText.y = app.screen.height / 2 - 36;

  app.stage.addChild(timerText);
  return timerText;
}

export function startTimer(app: Application, timerText: Text, onTimeout: () => void): void {
  let timePassed = 0;
  timerText.text = formatTime(timePassed);
  timerText.visible = true;

  const tick = (): void => {
    const delta = app.ticker.deltaMS / 1000;
    timePassed += delta;

    timerText.text = formatTime(Math.floor(timePassed));

    if (Math.floor(timePassed) >= seconds) {
      timerText.visible = false;
      app.ticker.remove(tick);
      onTimeout();
    }
  };

  const seconds = 100000000; 
  app.ticker.add(tick);
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}