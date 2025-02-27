import { ensureNonEmpty } from "./ensureNonEmpty";

describe("ensureNonEmpty", () => {
  it("should return the value if it is not empty", () => {
    expect(ensureNonEmpty([1, 2, 3])).toStrictEqual([1, 2, 3]);
    expect(ensureNonEmpty("hello")).toBe("hello");
    expect(ensureNonEmpty({ length: 0 })).toStrictEqual({ length: 0 });
  });

  it("should throw an error if the value is empty", () => {
    expect(() => ensureNonEmpty([])).toThrow("Value is empty");
    expect(() => ensureNonEmpty("")).toThrow("Value is empty");
    expect(() => ensureNonEmpty({})).toThrow("Value is empty");
  });

  it("should return a function that ensures the value is not empty", () => {
    const fn = ensureNonEmpty<Array<number>>();

    expect(fn([1, 2, 3])).toStrictEqual([1, 2, 3]);
    expect(() => fn([])).toThrow("Value is empty");
  });
});
