import { ensureNotNull } from "./ensureNotNull";

describe("ensureNotNull", () => {
  it("should return the value if it is not null", () => {
    expect(ensureNotNull(5)).toBe(5);
  });

  it("should throw an error if the value is null", () => {
    expect(() => ensureNotNull(null)).toThrow("Value is null");
  });

  it("should return a function that ensures the value is not null", () => {
    const fn = ensureNotNull<number>();

    expect(fn(5)).toBe(5);
    expect(() => fn(null)).toThrow("Value is null");
  });
});
