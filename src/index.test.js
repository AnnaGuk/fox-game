import "@testing-library/jest-dom/extend-expect";
import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";

const html = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf8");

let dom;
let container;

describe("index.html", () => {
  beforeEach(() => {
    dom = new JSDOM(html, {
      runScripts: "dangerously",
    });

    container = dom.window.document.body;
  });

  it("renders a modal with correct text", () => {
    expect(container.querySelector("div.modal-inner").textContent).toBe(
      "Press the middle button to start"
    );
  });

  it("renders three buttons", () => {
    const buttons = container.querySelectorAll("div.btn");
    expect(buttons.length).toBe(3);
  });

  it("renders three icons", () => {
    const icons = container.querySelectorAll("div.icon");
    expect(icons.length).toBe(3);
  });

  it("highlights one of the icons", () => {
    const icons = container.querySelectorAll("div.icon");
    expect(icons[0]).toHaveClass("highlighted");
  });
});
