import { ensureNonNullish } from "./ensureNonNullish";

describe("ensureNonNullish", () => {
  it("should return the value if it is not null", () => {
    expect(ensureNonNullish(5)).toBe(5);
  });

  it("should throw an error if the value is null", () => {
    expect(() => ensureNonNullish(null)).toThrow("Value is nullish");
  });

  it("should throw an error if the value is undefined", () => {
    expect(() => ensureNonNullish(undefined)).toThrow("Value is nullish");
  });

  it("should return a function that ensures the value is not null", () => {
    const fn = ensureNonNullish<number>();

    expect(fn(5)).toBe(5);
    expect(() => fn(null)).toThrow("Value is null");
  });
});
