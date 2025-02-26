import { ensureDefined } from "./ensureDefined";

describe("ensureDefined", () => {
  it("should return the value if it is defined", () => {
    expect(ensureDefined(5)).toBe(5);
  });

  it("should throw an error if the value is undefined", () => {
    expect(() => ensureDefined(undefined)).toThrow("Value is undefined");
  });

  it("should return a function that ensures the value is defined", () => {
    const fn = ensureDefined<number>();

    expect(fn(5)).toBe(5);
    expect(() => fn(undefined)).toThrow("Value is undefined");
  });
});
