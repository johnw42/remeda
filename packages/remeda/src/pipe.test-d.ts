import { map } from "./map";
import { pipe } from "./pipe";
import { take } from "./take";

it("should infer types correctly for single operation", () => {
  const result = pipe(1, (x) => x * 2);

  expectTypeOf(result).toEqualTypeOf<number>();
});

it("should infer types correctly for multiple operations", () => {
  const result = pipe(
    1,
    (x) => x * 2,
    (x) => x.toString(),
    (x) => x.length,
  );

  expectTypeOf(result).toEqualTypeOf<number>();
});

it("should infer types correctly for array operations", () => {
  const result = pipe(
    [1, 2, 3],
    map((x) => x * 2),
    take(2),
  );

  expectTypeOf(result).toEqualTypeOf<Array<number>>();
});

it("should infer types correctly for object operations", () => {
  const result = pipe(
    { a: 1, b: 2 },
    (obj) => ({ ...obj, c: 3 }),
    (obj) => Object.keys(obj),
  );

  expectTypeOf(result).toEqualTypeOf<Array<string>>();
});

it("should infer types correctly for mixed operations", () => {
  const result = pipe(
    [1, 2, 3],
    map((x) => x * 2),
    (arr) => arr.join(", "),
    (str) => str.length,
  );

  expectTypeOf(result).toEqualTypeOf<number>();
});
