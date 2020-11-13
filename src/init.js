import gameState, { handleUserAction } from "./gameState";
import { TICK_RATE } from "./constants";
import initButtons from "./buttons";

const init = async () => {
  initButtons(handleUserAction);

  let nextTimeToTick = Date.now();

  const nextAnimationFrame = () => {
    const now = Date.now();
    if (nextTimeToTick <= now) {
      gameState.tick();
      nextTimeToTick = now + TICK_RATE;
    }
    window.addEventListener("load", () => {
      gameState.startGame();
    });
    requestAnimationFrame(nextAnimationFrame);
  };

  nextAnimationFrame();
};

init();
