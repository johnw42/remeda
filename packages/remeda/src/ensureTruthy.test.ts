import { ensureTruthy } from "./ensureTruthy";

describe("ensureTruthy", () => {
  it("should return the value if it is truthy", () => {
    expect(ensureTruthy(5)).toBe(5);
  });

  it("should throw an error if the value is not truthy", () => {
    expect(() => ensureTruthy(0)).toThrow("Value is not truthy");
  });

  it("should return a function that ensures the value is truthy", () => {
    const fn = ensureTruthy<number>();

    expect(fn(5)).toBe(5);
    expect(() => fn(0)).toThrow("Value is not truthy");
  });
});
