import { modFox, modScene, togglePoopBag, writeModal } from "./UI";
import {
  RAIN_CHANCE,
  SCENES,
  DAY_LENGTH,
  NIGHT_LENGTH,
  getNextDieTime,
  getNextHungerTime,
  getNextPoopTime,
  writeToLocalStorage,
  removeFromLocalStorage,
  restoreFromLocalStorage,
} from "./constants";

const gameState = {
  current: restoreFromLocalStorage("current")
    ? restoreFromLocalStorage("current")
    : "INIT",
  clock: restoreFromLocalStorage("clock")
    ? restoreFromLocalStorage("clock")
    : 1,
  wakeTime: restoreFromLocalStorage("wakeTime")
    ? restoreFromLocalStorage("wakeTime")
    : -1,
  sleepTime: restoreFromLocalStorage("sleepTime")
    ? restoreFromLocalStorage("sleepTime")
    : -1,
  hungryTime: restoreFromLocalStorage("hungryTime")
    ? restoreFromLocalStorage("hungryTime")
    : -1,
  dieTime: restoreFromLocalStorage("dieTime")
    ? restoreFromLocalStorage("dieTime")
    : -1,
  poopTime: restoreFromLocalStorage("poopTime")
    ? restoreFromLocalStorage("poopTime")
    : -1,
  timeToStartCelebrating: restoreFromLocalStorage("timeToStartCelebrating")
    ? restoreFromLocalStorage("timeToStartCelebrating")
    : -1,
  timeToEndCelebrating: restoreFromLocalStorage("timeToEndCelebrating")
    ? restoreFromLocalStorage("timeToEndCelebrating")
    : -1,
  scene: restoreFromLocalStorage("scene")
    ? restoreFromLocalStorage("scene")
    : 0,
  tick() {
    this.clock++;

    if (this.clock === this.wakeTime) {
      this.wake();
    } else if (this.clock === this.sleepTime) {
      this.sleep();
    } else if (this.clock === this.hungryTime) {
      this.getHungry();
    } else if (this.clock === this.dieTime) {
      this.die();
    } else if (this.clock === this.timeToStartCelebrating) {
      this.startCelebrating();
    } else if (this.clock === this.timeToEndCelebrating) {
      this.endCelebrating();
    } else if (this.clock === this.poopTime) {
      this.poop();
    }

    return this.clock;
  },
  startGame() {
    if (
      this.current === "INIT" ||
      this.current === "DEAD" ||
      this.current === "HATCHING"
    ) {
      this.current = "HATCHING";
      this.wakeTime = this.clock + 3;
      modFox("egg");
      modScene("day");
      writeModal();
      writeToLocalStorage("current", this.current);
      writeToLocalStorage("wakeTime", this.wakeTime);
      writeToLocalStorage("clock", this.clock);
    } else {
      writeModal("Your game was restored");
      modScene(SCENES[this.scene]);

      switch (this.current) {
        case "IDLING":
          this.determineFoxState();
          window.setTimeout(writeModal, 3000);
          break;
        case "SLEEP":
          this.sleep();
          window.setTimeout(writeModal, 3000);
          break;
        case "HUNGRY":
          this.getHungry();
          window.setTimeout(writeModal, 3000);
          break;
        case "CELEBRATING":
          this.startCelebrating();
          window.setTimeout(writeModal, 3000);
          break;
        case "POOPING":
          this.poop();
          window.setTimeout(writeModal, 3000);
          break;
        case "FEEDING":
          this.feed();
          window.setTimeout(writeModal, 3000);
          break;
      }
    }
  },
  wake() {
    this.current = "IDLING";
    this.wakeTime = -1;
    this.scene = Math.random() > RAIN_CHANCE ? 0 : 1;
    modScene(SCENES[this.scene]);
    this.determineFoxState();
    this.sleepTime = this.clock + DAY_LENGTH;
    this.hungryTime = getNextHungerTime(this.clock);
    writeToLocalStorage("current", this.current);
    removeFromLocalStorage("wakeTime");
    writeToLocalStorage("sleepTime", this.sleepTime);
    writeToLocalStorage("hungryTime", this.hungryTime);
    writeToLocalStorage("clock", this.clock);
    writeToLocalStorage("scene", this.scene);
  },
  sleep() {
    this.current = "SLEEP";
    modFox("sleep");
    modScene("night");
    this.clearTimes();
    this.wakeTime = this.clock + NIGHT_LENGTH;
    togglePoopBag(false);
    writeToLocalStorage("wakeTime", this.wakeTime);
    writeToLocalStorage("clock", this.clock);
  },
  clearTimes() {
    this.wakeTime = -1;
    this.sleepTime = -1;
    this.hungryTime = -1;
    this.dieTime = -1;
    this.timeToStartCelebrating = -1;
    this.timeToEndCelebrating = -1;
    this.poopTime = -1;
    removeFromLocalStorage("wakeTime");
    removeFromLocalStorage("sleepTime");
    removeFromLocalStorage("hungryTime");
    removeFromLocalStorage("dieTime");
    removeFromLocalStorage("timeToStartCelebrating");
    removeFromLocalStorage("timeToEndCelebrating");
    removeFromLocalStorage("poopTime");
  },
  getHungry() {
    this.current = "HUNGRY";
    this.dieTime = getNextDieTime(this.clock);
    this.hungryTime = -1;
    modFox("hungry");
    writeToLocalStorage("current", this.current);
    writeToLocalStorage("dieTime", this.dieTime);
    removeFromLocalStorage("hungryTime");
    writeToLocalStorage("clock", this.clock);
  },
  die() {
    this.current = "DEAD";
    modScene("dead");
    modFox("dead");
    this.clearTimes();
    localStorage.clear();
    writeModal(
      "The fox died :( <br/> Press the middle button to restart the game"
    );
  },
  startCelebrating() {
    this.current = "CELEBRATING";
    modFox("celebrate");
    this.timeToStartCelebrating = -1;
    this.timeToEndCelebrating = this.clock + 2;
    writeToLocalStorage("current", this.current);
    removeFromLocalStorage("timeToStartCelebrating");
    writeToLocalStorage("timeToEndCelebrating", this.timeToEndCelebrating);
    writeToLocalStorage("clock", this.clock);
  },
  endCelebrating() {
    this.timeToEndCelebrating = -1;
    this.current = "IDLING";
    this.determineFoxState();
    togglePoopBag(false);
    removeFromLocalStorage("timeToEndCelebrating");
    writeToLocalStorage("current", this.current);
    writeToLocalStorage("clock", this.clock);
  },
  determineFoxState() {
    if (this.current === "IDLING") {
      SCENES[this.scene] === "rain" ? modFox("rain") : modFox("idling");
    }
  },
  poop() {
    this.current = "POOPING";
    this.poopTime = -1;
    this.dieTime = getNextDieTime(this.clock);
    modFox("pooping");
    writeToLocalStorage("current", this.current);
    removeFromLocalStorage("poopTime");
    writeToLocalStorage("dieTime", this.dieTime);
    writeToLocalStorage("clock", this.clock);
  },
  handleUserAction(icon) {
    if (
      ["SLEEP", "FEEDING", "CELEBRATING", "HATCHING"].includes(this.current)
    ) {
      return;
    }

    if (this.current === "INIT" || this.current === "DEAD") {
      localStorage.clear();
      this.startGame();
      return;
    }

    switch (icon) {
      case "weather":
        this.changeWeather();
        break;
      case "poop":
        this.cleanUpPoop();
        break;
      case "fish":
        this.feed();
        break;
    }
  },
  changeWeather() {
    this.scene = (1 + this.scene) % SCENES.length;
    modScene(SCENES[this.scene]);
    this.determineFoxState();
    writeToLocalStorage("scene", this.scene);
  },
  cleanUpPoop() {
    if (this.current === "POOPING") {
      this.dieTime = -1;
      togglePoopBag(true);
      this.startCelebrating();
      this.hungryTime = getNextHungerTime(this.clock);
      removeFromLocalStorage("dieTime");
      writeToLocalStorage("hungryTime", this.hungryTime);
      writeToLocalStorage("clock", this.clock);
    }
  },
  feed() {
    if (this.current !== "HUNGRY") {
      return;
    }

    this.current = "FEEDING";
    this.dieTime = -1;
    this.poopTime = getNextPoopTime(this.clock);
    modFox("eating");
    this.timeToStartCelebrating = this.clock + 2;
    writeToLocalStorage("current", this.current);
    removeFromLocalStorage("dieTime");
    writeToLocalStorage("poopTime", this.poopTime);
    writeToLocalStorage("timeToStartCelebrating", this.timeToStartCelebrating);
    writeToLocalStorage("clock", this.clock);
  },
};

export const handleUserAction = gameState.handleUserAction.bind(gameState);
export default gameState;
