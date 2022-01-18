describe("The Landing Page", () => {
  it("successfully loads", () => {
    cy.visit("/");
  });

  it("displays three buttons", () => {
    cy.get(".btn").should("have.length", 3);
  });

  it("displays three icons and highlights the first", () => {
    cy.get(".icon")
      .should("have.length", 3)
      .first()
      .should("have.class", "highlighted");
  });

  it("displays a modal with a correct text", () => {
    cy.get(".modal-inner").should(
      "have.text",
      "Press the middle button to start"
    );
  });
});

describe("Game start", () => {
  it("starts the game when pressing the button", () => {
    cy.get(".btn.middle-btn").click();
    cy.get(".fox").should("have.class", "fox-egg");
    cy.wait(9000);
    cy.get(".fox").should("have.class", "fox-idling");
  });

  it("changes the background correctly", () => {
    const classes = ["day", "rain"];

    cy.get(".game").should("satisfy", ($el) => {
      const classList = Array.from($el[0].classList);
      classes.splice(classes.indexOf(classList[1]), 1);

      return classes.length === 1;
    });
    cy.get(".btn.right-btn").click().click();
    cy.get(".btn.middle-btn").click();

    cy.get(".game").should("have.class", classes[1]);
    cy.get(".btn.middle-btn").click();
  });
});

describe("Game Play", () => {
  it("fox gets hungry after certain time", () => {
    cy.get(".fox", { timeout: 100000 }).should("have.class", "fox-hungry");
    cy.get(".btn.right-btn").click();
    cy.get(".btn.middle-btn").click();
    cy.get(".fox").should("have.class", "fox-eating");
  });

  it("fox wants to poop after certain time", () => {
    cy.get(".fox", { timeout: 100000 }).should("have.class", "fox-pooping");
    cy.get(".btn.right-btn").click();
    cy.get(".btn.middle-btn").click();
    cy.get(".poop-bag").should("not.have.class", "hidden");
  });

  it("fox dies if neglected for a long time", () => {
    cy.get(".fox", { timeout: 200000 }).should("have.class", "fox-dead");
    cy.get(".modal-inner").should(
      "have.text",
      "The fox died :(  Press the middle button to restart the game"
    );
  });
});
