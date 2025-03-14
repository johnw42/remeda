import { firstBy } from "./firstBy";
import { identity } from "./identity";
import { describeIterableArg } from "./internal/describeIterableArg";
import { pipe } from "./pipe";

// eslint-disable-next-line vitest/require-hook
describeIterableArg("firstBy", ({ wrap }) => {
  describe("runtime (dataFirst)", () => {
    it("returns undefined on empty", () => {
      expect(firstBy(wrap([]), identity())).toBeUndefined();
    });

    it("returns the item on a single item array", () => {
      expect(firstBy(wrap([1]), identity())).toBe(1);
    });

    it("finds the minimum", () => {
      expect(firstBy(wrap([2, 1, 4, 3, 5]), identity())).toBe(1);
    });

    it("finds the minimum with a non-trivial order rule", () => {
      expect(
        firstBy(wrap(["aa", "a", "aaaa", "aaa", "aaaaa"]), (x) => x.length),
      ).toBe("a");
    });

    it("finds the max with 'desc' order rules", () => {
      expect(firstBy(wrap([2, 1, 4, 3, 5]), [identity(), "desc"])).toBe(5);
    });

    it("finds the max with non-trivial 'desc' order rules", () => {
      expect(
        firstBy(wrap(["aa", "a", "aaaa", "aaa", "aaaaa"]), [
          identity(),
          "desc",
        ]),
      ).toBe("aaaaa");
    });

    it("breaks ties with multiple order rules", () => {
      const data = ["a", "bb", "b", "aaaa", "bbb", "aa", "aaa", "bbbb"];

      expect(firstBy(wrap(data), (x) => x.length, identity())).toBe("a");
      expect(firstBy(wrap(data), [(x) => x.length, "desc"], identity())).toBe(
        "aaaa",
      );
      expect(firstBy(wrap(data), (x) => x.length, [identity(), "desc"])).toBe(
        "b",
      );
      expect(
        firstBy(wrap(data), [(x) => x.length, "desc"], [identity(), "desc"]),
      ).toBe("bbbb");
    });

    it("can compare strings", () => {
      expect(firstBy(wrap(["b", "a", "c"]), identity())).toBe("a");
    });

    it("can compare numbers", () => {
      expect(firstBy(wrap([2, 1, 3]), identity())).toBe(1);
    });

    it("can compare booleans", () => {
      expect(firstBy(wrap([true, false, true, true, false]), identity())).toBe(
        false,
      );
    });

    it("can compare valueOfs", () => {
      expect(
        firstBy(wrap([new Date(), new Date(1), new Date(2)]), identity()),
      ).toStrictEqual(new Date(1));
    });
  });

  describe("runtime (dataLast)", () => {
    it("returns undefined on empty", () => {
      expect(pipe(wrap([]), firstBy(identity()))).toBeUndefined();
    });

    it("returns the item on a single item array", () => {
      expect(pipe(wrap([1]), firstBy(identity()))).toBe(1);
    });

    it("finds the minimum", () => {
      expect(pipe(wrap([2, 1, 4, 3, 5]), firstBy(identity()))).toBe(1);
    });

    it("finds the minimum with a non-trivial order rule", () => {
      expect(
        pipe(
          wrap(["aa", "a", "aaaa", "aaa", "aaaaa"]),
          firstBy((x) => x.length),
        ),
      ).toBe("a");
    });

    it("finds the max with 'desc' order rules", () => {
      expect(pipe(wrap([2, 1, 4, 3, 5]), firstBy([identity(), "desc"]))).toBe(
        5,
      );
    });

    it("finds the max with non-trivial 'desc' order rules", () => {
      expect(
        pipe(
          wrap(["aa", "a", "aaaa", "aaa", "aaaaa"]),
          firstBy([identity(), "desc"]),
        ),
      ).toBe("aaaaa");
    });

    it("breaks ties with multiple order rules", () => {
      const data = ["a", "bb", "b", "aaaa", "bbb", "aa", "aaa", "bbbb"];

      expect(
        pipe(
          wrap(data),
          firstBy((x) => x.length, identity()),
        ),
      ).toBe("a");
      expect(
        pipe(wrap(data), firstBy([(x) => x.length, "desc"], identity())),
      ).toBe("aaaa");
      expect(
        pipe(
          wrap(data),
          firstBy((x) => x.length, [identity(), "desc"]),
        ),
      ).toBe("b");
      expect(
        pipe(
          wrap(data),
          firstBy([(x: string) => x.length, "desc"], [identity(), "desc"]),
        ),
      ).toBe("bbbb");
    });

    it("can compare strings", () => {
      expect(pipe(wrap(["b", "a", "c"]), firstBy(identity()))).toBe("a");
    });

    it("can compare numbers", () => {
      expect(pipe(wrap([2, 1, 3]), firstBy(identity()))).toBe(1);
    });

    it("can compare booleans", () => {
      expect(
        pipe(wrap([true, false, true, true, false]), firstBy(identity())),
      ).toBe(false);
    });

    it("can compare valueOfs", () => {
      expect(
        pipe(wrap([new Date(), new Date(1), new Date(2)]), firstBy(identity())),
      ).toStrictEqual(new Date(1));
    });
  });
});
