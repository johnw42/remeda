import { filter } from "../../filter";
import { map } from "../../map";
import { pipe } from "../../pipe";

describe("data first", () => {
  it("filter with array and data arg in callback", () => {
    filter([1, 2, 3] as const, (x, _i, data): x is 1 => {
      expectTypeOf(data).toEqualTypeOf<readonly [1, 2, 3]>();

      return x === 1;
    });
  });

  it("filter with iterable and data arg in callback", () => {
    filter([1, 2, 3] as Iterable<number>, (x, _i, data): x is 1 => {
      expectTypeOf(data).toEqualTypeOf<ReadonlyArray<number>>();

      return x === 1;
    });
  });

  it("map with array and data arg in callback", () => {
    map([1, 2, 3] as const, (x, _i, data): string => {
      expectTypeOf(data).toEqualTypeOf<readonly [1, 2, 3]>();

      return String(x);
    });
  });

  it("map with iterable and data arg in callback", () => {
    map([1, 2, 3] as Iterable<number>, (x, _i, data): string => {
      expectTypeOf(data).toEqualTypeOf<ReadonlyArray<number>>();

      return String(x);
    });
  });
});

describe("data last", () => {
  it("filter with array and data arg in callback", () => {
    pipe(
      [1, 2, 3] as const,
      filter((x, _i, data): x is 1 => {
        expectTypeOf(data).toEqualTypeOf<readonly [1, 2, 3]>();

        return x === 1;
      }),
    );
  });

  it("filter with iterable and data arg in callback", () => {
    pipe(
      [1, 2, 3] as Iterable<number>,
      filter((x, _i, data): x is 1 => {
        expectTypeOf(data).toEqualTypeOf<ReadonlyArray<number>>();

        return x === 1;
      }),
    );
  });

  it("map with array and data arg in callback", () => {
    pipe(
      [1, 2, 3] as const,
      map((x, _i, data): string => {
        expectTypeOf(data).toEqualTypeOf<readonly [1, 2, 3]>();

        return String(x);
      }),
    );
  });

  it("map with iterable and data arg in callback", () => {
    pipe(
      [1, 2, 3] as Iterable<number>,
      map((x, _i, data): string => {
        expectTypeOf(data).toEqualTypeOf<ReadonlyArray<number>>();

        return String(x);
      }),
    );
  });
});
