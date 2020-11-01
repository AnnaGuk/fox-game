import gameState from "./gameState";

const TICK_RATE = 3000;

const init = async () => {
  console.log("starting game");

  let nextTimeToTick = Date.now();

  const nextAnimationFrame = () => {
    const now = Date.now();
    if (nextTimeToTick <= now) {
      gameState.tick();
      nextTimeToTick = now + TICK_RATE;
    }
    requestAnimationFrame(nextAnimationFrame);
  };

  nextAnimationFrame();
};

init();
