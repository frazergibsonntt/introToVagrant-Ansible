const chai = require("chai");
const mocha = require("mocha");

const { assert, expect } = chai;

const app = require("../js/main.js");

describe("Testing Main.js", () => {
  // Checking whether generateRandomNumber exist
  it("Check whether the generateRandomNumber function exit", () => {
    expect(app.generateRandomNumber).to.exist();
  });

  // Checking whether removeRow function exist
  it("Check whether the removeRow function exit", () => {
    expect(app.removeRow).to.exist();
  });

  // Checking whether onSubmit function exist
  it("Check whether the onSubmit function exit", () => {
    expect(app.onSubmit).to.exist();
  });
});
