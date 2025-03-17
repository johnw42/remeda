import { describeIterableArg } from "./internal/describeIterableArg";
import { length } from "./length";
import { pipe } from "./pipe";

describeIterableArg("length", ({ wrap }) => {
  test("data first", () => {
    expect(length(wrap([0, 1, 2, 3, 4]))).toBe(5);
  });

  test("curried", () => {
    expect(pipe(wrap([0, 1, 2, 3, 4]), length())).toBe(5);
  });
});
