import { add } from "./add";
import { fromKeys } from "./fromKeys";
import { describeIterableArg } from "./internal/describeIterableArg";
import { pipe } from "./pipe";

describeIterableArg("fromKeys", ({ wrap }) => {
  it("works on trivially empty arrays", () => {
    expect(
      fromKeys(wrap([] as Array<string>), (item) => `${item}_`),
    ).toStrictEqual({});
  });

  it("works on regular arrays", () => {
    expect(fromKeys(wrap(["a"]), (item) => `${item}_`)).toStrictEqual({
      a: "a_",
    });
  });

  it("works with duplicates", () => {
    expect(fromKeys(wrap(["a", "a"]), (item) => `${item}_`)).toStrictEqual({
      a: "a_",
    });
  });

  it("uses the last value", () => {
    let counter = 0;

    expect(
      fromKeys(wrap(["a", "a"]), () => {
        counter += 1;
        return counter;
      }),
    ).toStrictEqual({ a: 2 });
  });

  it("works with number keys", () => {
    expect(fromKeys(wrap([123]), add(1))).toStrictEqual({ 123: 124 });
  });

  it("works with symbols", () => {
    const symbol = Symbol("a");

    expect(fromKeys(wrap([symbol]), () => 1)).toStrictEqual({ [symbol]: 1 });
  });

  it("works with a mix of key types", () => {
    const symbol = Symbol("a");

    expect(
      fromKeys(wrap(["a", 123, symbol]), (item) => typeof item),
    ).toStrictEqual({
      a: "string",
      123: "number",
      [symbol]: "symbol",
    });
  });

  describe("dataLast", () => {
    it("works on trivially empty arrays", () => {
      expect(
        pipe(
          wrap([] as Array<string>),
          fromKeys((item) => `${item}_`),
        ),
      ).toStrictEqual({});
    });

    it("works on regular arrays", () => {
      expect(
        pipe(
          wrap(["a"]),
          fromKeys((item) => `${item}_`),
        ),
      ).toStrictEqual({ a: "a_" });
    });

    it("works with duplicates", () => {
      expect(
        pipe(
          wrap(["a", "a"]),
          fromKeys((item) => `${item}_`),
        ),
      ).toStrictEqual({ a: "a_" });
    });

    it("uses the last value", () => {
      let counter = 0;

      expect(
        pipe(
          wrap(["a", "a"]),
          fromKeys(() => {
            counter += 1;
            return counter;
          }),
        ),
      ).toStrictEqual({ a: 2 });
    });

    it("works with number keys", () => {
      expect(pipe(wrap([123]), fromKeys(add(1)))).toStrictEqual({ 123: 124 });
    });

    it("works with symbols", () => {
      const symbol = Symbol("a");

      expect(
        pipe(
          wrap([symbol]),
          fromKeys(() => 1),
        ),
      ).toStrictEqual({ [symbol]: 1 });
    });

    it("works with a mix of key types", () => {
      const symbol = Symbol("a");

      expect(
        pipe(
          wrap(["a", 123, symbol]),
          fromKeys((item) => typeof item),
        ),
      ).toStrictEqual({
        a: "string",
        123: "number",
        [symbol]: "symbol",
      });
    });
  });
});
