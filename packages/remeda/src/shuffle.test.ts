import { difference } from "./difference";
import { describeIterableArg } from "./internal/describeIterableArg";
import { pipe } from "./pipe";
import { shuffle } from "./shuffle";

describeIterableArg("shuffle", ({ wrap }) => {
  test("data-first", () => {
    const input = [4, 2, 7, 5] as const;

    const shuffled = shuffle(wrap(input));

    // Shuffled array has the same items
    expect(shuffled).toHaveLength(4);
    expect(difference(input, shuffled)).toHaveLength(0);
    expect(difference(shuffled, input)).toHaveLength(0);

    // Original array not mutated
    expect(shuffled).not.toBe(input);
    expect(input).toStrictEqual([4, 2, 7, 5]);
  });

  test("data-last", () => {
    const input = [4, 2, 7, 5] as const;

    const shuffled = pipe(wrap(input), shuffle());

    // Shuffled array has the same items
    expect(shuffled).toHaveLength(4);
    expect(difference(input, shuffled)).toHaveLength(0);
    expect(difference(shuffled, input)).toHaveLength(0);

    // Original array not mutated
    expect(shuffled).not.toBe(input);
    expect(input).toStrictEqual([4, 2, 7, 5]);
  });
});
