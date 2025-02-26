import { force } from "./force";

describe("force", () => {
  it("should return the value if it is not a function", () => {
    expect(force(5)).toBe(5);
  });

  it("should call the function and return its value", () => {
    expect(force(() => 5)).toBe(5);
  });

  it("should return a function that forces the value", () => {
    const fn = force<number>();

    expect(fn(5)).toBe(5);
    expect(fn(() => 5)).toBe(5);
  });
});
