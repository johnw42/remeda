import { ensureInstanceOf } from "./ensureInstanceOf";

describe("ensureInstanceOf", () => {
  it("should return the value if it is an instance of the provided constructor", () => {
    expect(ensureInstanceOf(new Date(), Date)).toBeInstanceOf(Date);
  });

  it("should throw an error if the value is not an instance of the provided constructor", () => {
    expect(() => ensureInstanceOf({}, Date)).toThrow(
      "Value is not an instance of Date",
    );
  });

  it("should return a function that ensures the value is an instance of the provided constructor", () => {
    const fn = ensureInstanceOf<Date>(Date);

    expect(fn(new Date())).toBeInstanceOf(Date);
    expect(() => fn({})).toThrow("Value is not an instance of Date");
  });
});
