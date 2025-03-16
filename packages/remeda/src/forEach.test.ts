import { forEach } from "./forEach";
import { describeIterableArg } from "./internal/describeIterableArg";
import { toBasicIterable } from "./internal/toBasicIterable";
import { pipe } from "./pipe";
import { take } from "./take";

describeIterableArg("forEach", ({ wrap, wrappedArray }) => {
  test("dataFirst", () => {
    const array = [1, 2, 3];
    const data = wrap(array);
    const cb =
      vi.fn<(x: number, index: number, data: ReadonlyArray<number>) => void>();

    forEach(data, cb);

    expect(cb).toHaveBeenCalledTimes(3);
    expect(cb).toHaveBeenCalledWith(1, 0, wrappedArray(array));
    expect(cb).toHaveBeenCalledWith(2, 1, wrappedArray(array));
    expect(cb).toHaveBeenCalledWith(3, 2, wrappedArray(array));
  });

  test("dataLast", () => {
    const array = [1, 2, 3];
    const data = wrap(array);
    const cb =
      vi.fn<(x: number, index: number, data: ReadonlyArray<number>) => void>();

    // Because the callback is used before forEach "sees" `data`, we need to
    // explicitly tell it the how to type the `data` param..
    const result = forEach<typeof data>(cb)(data);

    expect(cb).toHaveBeenCalledWith(1, 0, wrappedArray(array));
    expect(cb).toHaveBeenCalledWith(2, 1, wrappedArray(array));
    expect(cb).toHaveBeenCalledWith(3, 2, wrappedArray(array));

    // dataLast used directly, we return the same reference.
    expect(result).toBe(data);
  });

  test("pipe", () => {
    const array = [1, 2, 3];
    const data = wrap(array);
    const cb =
      vi.fn<(x: number, index: number, data: Iterable<number>) => void>();

    const result = pipe(data, forEach(cb));

    expect(cb).toHaveBeenCalledWith(1, 0, wrappedArray(array));
    expect(cb).toHaveBeenCalledWith(2, 1, wrappedArray(array));
    expect(cb).toHaveBeenCalledWith(3, 2, wrappedArray(array));

    expect([...result]).toStrictEqual(array);

    // The pipe reconstructs the array because it runs lazily.
    expect(result).not.toBe(data);
  });

  test("with take", () => {
    const count = vi.fn<() => void>();
    const result = pipe(
      wrap([1, 2, 3]),
      forEach(() => {
        count();
      }),
      take(2),
    );

    expect(count).toHaveBeenCalledTimes(2);
    expect(result).toStrictEqual([1, 2]);
  });
});

test("lazy", () => {
  const count1 = vi.fn<() => void>();
  const count2 = vi.fn<(n: number) => void>((n) => {
    expect(count1).toHaveBeenCalledTimes(n);
  });
  const result = pipe(
    toBasicIterable([1, 2, 3]),
    forEach(count1),
    forEach(count2),
  );

  expect(count1).toHaveBeenCalledTimes(3);
  expect(count2).toHaveBeenCalledTimes(3);
  expect(result).toStrictEqual([1, 2, 3]);
});
