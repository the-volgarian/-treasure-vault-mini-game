import { Application, Text, TextStyle } from 'pixi.js';

const TIMER_FONT_SIZE = 55;
const TIMER_FILL_COLOR = '#ff0000';
const TIMER_STROKE_COLOR = '#000000';
const TIMER_X_OFFSET = 45;
const TIMER_Y_OFFSET = 36;
export const TIMER_DURATION_SECONDS = 100000000;

type TimerController = {
  stop: () => void;
  getTime: () => number;
};

export function initTimer(app: Application): Text {
  const timerText = new Text({
    text: '00:00',
    style: new TextStyle({
      fontFamily: 'Arial',
      fontSize: TIMER_FONT_SIZE,
      fill: TIMER_FILL_COLOR,
      stroke: TIMER_STROKE_COLOR,
      align: 'center',
    }),
  });

  timerText.anchor.set(0.5);
  timerText.x = app.screen.width / 3 - TIMER_X_OFFSET;
  timerText.y = app.screen.height / 2 - TIMER_Y_OFFSET;

  app.stage.addChild(timerText);
  return timerText;
}

export function startTimer(
  app: Application, 
  timerText: Text, 
  onTimeout: () => void,
  durationSeconds: number = TIMER_DURATION_SECONDS
): TimerController {
  let timePassed = 0;
  timerText.text = formatTime(0);
  timerText.visible = true;

  const tick = (): void => {
    const delta = app.ticker.deltaMS / 1000;
    timePassed += delta;
    timerText.text = formatTime(Math.floor(timePassed));

    if (Math.floor(timePassed) >= durationSeconds) {
      timerText.visible = false;
      app.ticker.remove(tick);
      onTimeout();
    }
  };

  app.ticker.add(tick);

  return {
    stop: () => app.ticker.remove(tick),
    getTime: () => Math.floor(timePassed)
  };
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
