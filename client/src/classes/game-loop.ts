export class GameLoop {
  onStep: () => void;
  onPause: () => void;

  rafCallback: null;
  hasStopped: boolean;
  isPaused: boolean;
  isRunning: boolean;

  constructor(onStep, onPause) {
    this.onStep = onStep;
    this.onPause = onPause;
    this.rafCallback = null;
    this.hasStopped = false;
    this.isPaused = false;
    this.isRunning = false;

    this.start();
  }

  start() {
    this.isRunning = true;
    let previousMs;
    const step = 1 / 60;
    const tick = (timestampMs) => {
      if (this.hasStopped) {
        return;
      }
      if (previousMs === undefined) {
        previousMs = timestampMs;
      }
      let delta = (timestampMs - previousMs) / 1000;
      while (delta >= step) {
        if (!this.isPaused) {
          this?.onStep();
        }

        delta -= step;
      }
      previousMs = timestampMs - delta * 1000;
      //Recapture the callback to be able to shut it off
      this.rafCallback = requestAnimationFrame(tick);
    };

    // Initial kickoff
    this.rafCallback = requestAnimationFrame(tick);
  }

  stop() {
    this.isRunning = false;
    this.hasStopped = true;
    cancelAnimationFrame(this.rafCallback);
  }

  pause() {
    this.isRunning = false;
    this.onPause();
    this.isPaused = true;
  }

  continue() {
    this.isRunning = true;
    this.isPaused = false;
  }
}
