import { ensureInstance } from "./ensureInstance";

describe("ensureInstance", () => {
  it("should return the value if it is an instance of the provided constructor", () => {
    expect(ensureInstance(new Date(), Date)).toBeInstanceOf(Date);
  });

  it("should throw an error if the value is not an instance of the provided constructor", () => {
    expect(() => ensureInstance({}, Date)).toThrow(
      "Value is not an instance of Date",
    );
  });

  it("should return a function that ensures the value is an instance of the provided constructor", () => {
    const fn = ensureInstance<Date>(Date);

    expect(fn(new Date())).toBeInstanceOf(Date);
    expect(() => fn({})).toThrow("Value is not an instance of Date");
  });
});
