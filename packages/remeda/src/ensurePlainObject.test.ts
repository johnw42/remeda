import { ensurePlainObject } from "./ensurePlainObject";

describe("ensurePlainObject", () => {
  it("should return the value if it is a plain object", () => {
    expect(ensurePlainObject({})).toStrictEqual({});
  });

  it("should throw an error if the value is not a plain object", () => {
    expect(() => ensurePlainObject([])).toThrow("Value is not a plain object");
    expect(() => ensurePlainObject(null)).toThrow(
      "Value is not a plain object",
    );
    expect(() => ensurePlainObject(new Date())).toThrow(
      "Value is not a plain object",
    );
  });

  it("should return a function that ensures the value is a plain object", () => {
    const fn = ensurePlainObject<object>();

    expect(fn({})).toStrictEqual({});
    expect(() => fn([])).toThrow("Value is not a plain object");
  });
});
