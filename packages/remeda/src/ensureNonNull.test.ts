import { ensureNonNull } from "./ensureNonNull";

describe("ensureNonNull", () => {
  it("should return the value if it is not null", () => {
    expect(ensureNonNull(5)).toBe(5);
    expect(ensureNonNull(undefined)).toBeUndefined();
  });

  it("should throw an error if the value is null", () => {
    expect(() => ensureNonNull(null)).toThrow("Value is null");
  });

  it("should return a function that ensures the value is not null", () => {
    const fn = ensureNonNull<number>();

    expect(fn(5)).toBe(5);
    expect(() => fn(null)).toThrow("Value is null");
  });
});
