import { describe, it, expect } from "vitest";
import fs from "node:fs";
describe("App HTTP", () => {
  it("App file exists", () => {
    expect(fs.existsSync("src/app/App.js")).toBe(true);
  });
  it("Swagger file exists", () => {
    expect(fs.existsSync("src/app/Swagger.js")).toBe(true);
  });
  it("ApplicationContainer exists", () => {
    expect(fs.existsSync("src/app/ApplicationContainer.js")).toBe(true);
  });
});
