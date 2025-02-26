import { ensure } from "./ensure";

describe("ensure", () => {
  it("should return the value if the predicate is true", () => {
    expect(ensure(5, (x) => x > 0)).toBe(5);
  });

  it("should throw an error if the predicate is false", () => {
    expect(() => ensure(5, (x) => x < 0)).toThrow("Invalid value");
  });

  it("should return a function that ensures the value", () => {
    const fn = ensure<number>((x) => x > 0);

    expect(fn(5)).toBe(5);
    expect(() => fn(-5)).toThrow("Invalid value");
  });
});
