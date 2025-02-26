import { ensureType } from "./ensureType";

describe("ensureType", () => {
  it("should return the value if it is of the provided type", () => {
    expect(ensureType(5, "number")).toBe(5);
  });

  it("should throw an error if the value is not of the provided type", () => {
    expect(() => ensureType(5, "string")).toThrow(
      "Value is not of type string",
    );
  });

  it("should return a function that ensures the value is of the provided type", () => {
    const fn = ensureType("number");

    expect(fn(5)).toBe(5);
    expect(() => fn("5")).toThrow("Value is not of type number");
  });
});
