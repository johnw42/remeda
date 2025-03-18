import { fromEntries } from "./fromEntries";
import { describeIterableArg } from "./internal/describeIterableArg";
import { pipe } from "./pipe";

describeIterableArg("fromEntries", ({ wrap }) => {
  test("dataFirst", () => {
    expect(
      fromEntries(
        wrap([
          ["a", 1],
          ["b", 2],
          ["c", 3],
        ]),
      ),
    ).toStrictEqual({ a: 1, b: 2, c: 3 });
  });

  test("dataLast", () => {
    expect(
      pipe(
        wrap([
          ["a", 1],
          ["b", 2],
          ["c", 3],
        ] as const),
        fromEntries(),
      ),
    ).toStrictEqual({ a: 1, b: 2, c: 3 });
  });

  test("empty array", () => {
    expect(fromEntries(wrap([]))).toStrictEqual({});
  });

  test("single entry", () => {
    expect(fromEntries(wrap([["a", 1]]))).toStrictEqual({ a: 1 });
  });

  test("boolean values", () => {
    expect(
      fromEntries(
        wrap([
          ["hello", true],
          ["world", false],
        ]),
      ),
    ).toStrictEqual({ hello: true, world: false });
  });

  test("string values", () => {
    expect(fromEntries(wrap([["a", "d"]]))).toStrictEqual({ a: "d" });
  });

  test("number keys and values", () => {
    expect(fromEntries(wrap([[1, 123]]))).toStrictEqual({ 1: 123 });
  });
});
