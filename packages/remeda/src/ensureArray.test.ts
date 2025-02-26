import { ensureArray } from "./ensureArray";

describe("ensureArray", () => {
  it("should return the value if it is an array", () => {
    expect(ensureArray([1, 2, 3])).toStrictEqual([1, 2, 3]);
  });

  it("should throw an error if the value is not an array", () => {
    expect(() => ensureArray(5)).toThrow("Value is not an array");
  });

  it("should return a function that ensures the value is an array", () => {
    const fn = ensureArray<number>();

    expect(fn([1, 2, 3])).toStrictEqual([1, 2, 3]);
    expect(() => fn(5 as unknown)).toThrow("Value is not an array");
  });
});
