import { identity } from "./identity";
import { describeIterableArg } from "./internal/describeIterableArg";
import { rankBy } from "./rankBy";

describeIterableArg("rankBy (dataFirst)", ({ wrap }) => {
  it("works trivially with empty arrays", () => {
    expect(rankBy(wrap([]), 1, identity)).toBe(0);
  });

  it("maintains the rank for items already in the array", () => {
    const data = [5, 1, 3] as const;
    const sorted = [...data].sort((a, b) => a - b);
    for (const [index, item] of sorted.entries()) {
      expect(rankBy(wrap(data), item, identity())).toBe(index);
    }
  });

  it("can rank items not in the array", () => {
    const data = [5, 1, 3] as const;

    expect(rankBy(wrap(data), 0, identity())).toBe(0);
    expect(rankBy(wrap(data), 2, identity())).toBe(1);
    expect(rankBy(wrap(data), 4, identity())).toBe(2);
  });

  it("finds items ranked at the end of the array", () => {
    const data = [5, 1, 3] as const;

    expect(rankBy(wrap(data), 6, identity())).toBe(3);
  });
});
