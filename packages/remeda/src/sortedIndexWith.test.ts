/**
 * This utility function simply delegates the call to `binarySearchCutoffIndex`,
 * so we test it mainly via the tests for that function.
 */

import { describeIterableArg } from "./internal/describeIterableArg";
import { sortedIndexWith } from "./sortedIndexWith";

describeIterableArg("sortedIndexWith", ({ wrap }) => {
  test("regular", () => {
    expect(
      sortedIndexWith(wrap([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), (x) => x < 5),
    ).toBe(5);
  });

  test("indexed", () => {
    expect(
      sortedIndexWith(
        wrap(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]),
        (_, index) => index < 5,
      ),
    ).toBe(5);
  });
});
