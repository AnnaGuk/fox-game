import gameState from "./gameState";
import { TICK_RATE } from "./constants";
import initButtons from "./buttons";

const init = async () => {
  console.log("starting game");

  initButtons(gameState.handleUserAction);

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
