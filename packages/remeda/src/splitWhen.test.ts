import { describeIterableArg } from "./internal/describeIterableArg";
import { splitWhen } from "./splitWhen";

describeIterableArg("splitWhen", ({ wrap }) => {
  it("should split array", () => {
    expect(
      splitWhen(wrap([1, 2, 3, 1, 2, 3] as const), (x) => x === 2),
    ).toStrictEqual([[1], [2, 3, 1, 2, 3]]);
  });

  it("should work with no matches", () => {
    const n = 1232;

    const data = [1, 2, 3, 1, 2, 3];
    const [before, after] = splitWhen(wrap(data), (x) => x === n);

    expect(before).not.toBe(data);
    expect(before).toStrictEqual(data);
    expect(after).toStrictEqual([]);
  });
});
