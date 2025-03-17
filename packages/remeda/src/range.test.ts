import { pipe } from "./pipe";
import { range } from "./range";
import { take } from "./take";

describe("data first", () => {
  test("range", () => {
    expect(range(1, 5)).toStrictEqual([1, 2, 3, 4]);
  });
});

describe("data last", () => {
  test("range", () => {
    expect(range(5)(1)).toStrictEqual([1, 2, 3, 4]);
  });

  it("supports a missing upper bound", () => {
    expect(pipe(1, range(), take(4))).toStrictEqual([1, 2, 3, 4]);
  });

  it("supports an infinite upper bound", () => {
    expect(pipe(1, range(Infinity), take(4))).toStrictEqual([1, 2, 3, 4]);
  });
});
