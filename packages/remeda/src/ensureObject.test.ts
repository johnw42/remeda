import { ensureObject } from "./ensureObject";

describe("ensureObject", () => {
  it("should return the value if it is an object", () => {
    expect(ensureObject({})).toStrictEqual({});
  });

  it("should throw an error if the value is not an object", () => {
    expect(() => ensureObject(null)).toThrow("Value is not an object");
  });

  it("should return a function that ensures the value is an object", () => {
    const fn = ensureObject();

    expect(fn({})).toStrictEqual({});
    expect(() => fn(null)).toThrow("Value is not an object");
  });
});
