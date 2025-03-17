import { nthBy } from "./nthBy";
import { identity } from "./identity";
import { pipe } from "./pipe";
import { describeIterableArg } from "./internal/describeIterableArg";

describeIterableArg("nthBy", ({ wrap }) => {
  describe("runtime (dataFirst)", () => {
    it("works", () => {
      const data = [2, 1, 3];

      expect(nthBy(wrap(data), 0, identity())).toBe(1);
      expect(nthBy(wrap(data), 1, identity())).toBe(2);
      expect(nthBy(wrap(data), 2, identity())).toBe(3);
    });

    it("handles negative indexes", () => {
      const data = [2, 1, 3];

      expect(nthBy(wrap(data), -1, identity())).toBe(3);
      expect(nthBy(wrap(data), -2, identity())).toBe(2);
      expect(nthBy(wrap(data), -3, identity())).toBe(1);
    });

    it("handles overflows gracefully", () => {
      expect(nthBy([1, 2, 3], 100, identity())).toBeUndefined();
      expect(nthBy([1, 2, 3], -100, identity())).toBeUndefined();
    });

    it("works with complex order rules", () => {
      const data = [
        "aaaa",
        "b",
        "bb",
        "a",
        "aaa",
        "bbbb",
        "aa",
        "bbb",
      ] as const;

      expect(nthBy(wrap(data), 0, (a) => a.length, identity())).toBe("a");
      expect(nthBy(wrap(data), 1, (a) => a.length, identity())).toBe("b");
      expect(nthBy(wrap(data), 2, (a) => a.length, identity())).toBe("aa");
      expect(nthBy(wrap(data), 3, (a) => a.length, identity())).toBe("bb");
      expect(nthBy(wrap(data), 4, (a) => a.length, identity())).toBe("aaa");
      expect(nthBy(wrap(data), 5, (a) => a.length, identity())).toBe("bbb");
      expect(nthBy(wrap(data), 6, (a) => a.length, identity())).toBe("aaaa");
      expect(nthBy(wrap(data), 7, (a) => a.length, identity())).toBe("bbbb");
    });
  });

  describe("runtime (dataLast)", () => {
    it("works", () => {
      const data = [2, 1, 3];

      expect(pipe(wrap(data), nthBy(0, identity()))).toBe(1);
      expect(pipe(wrap(data), nthBy(1, identity()))).toBe(2);
      expect(pipe(wrap(data), nthBy(2, identity()))).toBe(3);
    });

    it("handles negative indexes", () => {
      const data = [2, 1, 3];

      expect(pipe(wrap(data), nthBy(-1, identity()))).toBe(3);
      expect(pipe(wrap(data), nthBy(-2, identity()))).toBe(2);
      expect(pipe(wrap(data), nthBy(-3, identity()))).toBe(1);
    });

    it("handles overflows gracefully", () => {
      expect(pipe([1, 2, 3], nthBy(100, identity()))).toBeUndefined();
      expect(pipe([1, 2, 3], nthBy(-100, identity()))).toBeUndefined();
    });

    it("works with complex order rules", () => {
      const data = [
        "aaaa",
        "b",
        "bb",
        "a",
        "aaa",
        "bbbb",
        "aa",
        "bbb",
      ] as const;

      expect(
        pipe(
          wrap(data),
          nthBy(0, (a) => a.length, identity()),
        ),
      ).toBe("a");
      expect(
        pipe(
          wrap(data),
          nthBy(1, (a) => a.length, identity()),
        ),
      ).toBe("b");
      expect(
        pipe(
          wrap(data),
          nthBy(2, (a) => a.length, identity()),
        ),
      ).toBe("aa");
      expect(
        pipe(
          wrap(data),
          nthBy(3, (a) => a.length, identity()),
        ),
      ).toBe("bb");
      expect(
        pipe(
          wrap(data),
          nthBy(4, (a) => a.length, identity()),
        ),
      ).toBe("aaa");
      expect(
        pipe(
          wrap(data),
          nthBy(5, (a) => a.length, identity()),
        ),
      ).toBe("bbb");
      expect(
        pipe(
          wrap(data),
          nthBy(6, (a) => a.length, identity()),
        ),
      ).toBe("aaaa");
      expect(
        pipe(
          wrap(data),
          nthBy(7, (a) => a.length, identity()),
        ),
      ).toBe("bbbb");
    });
  });
});
