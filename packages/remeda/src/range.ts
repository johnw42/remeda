import doProduce, { type DoProduceResult } from "./internal/doProduce";
import type { Producer } from "./internal/types/LazyEffect";

/**
 * Returns a list of numbers from `start` (inclusive) to `end` (exclusive).
 *
 * @param start - The start number.
 * @param end - The end number.
 * @signature range(start, end)
 * @example
 *    R.range(1, 5) // => [1, 2, 3, 4]
 * @dataFirst
 * @category Array
 */
export function range(start: number, end: number): Array<number>;

/**
 * Returns a list of numbers from `start` (inclusive) to `end` (exclusive).
 *
 * @param end - The end number; may be `Infinity` or omitted entirely when called in a lazy context.
 * @signature range(end)(start)
 * @example
 *    R.range(5)(1) // => [1, 2, 3, 4]
 *    R.pipe(1, R.range(), R.take(4)) // => [1, 2, 3, 4]
 * @dataLast
 * @category Array
 */
export function range(end?: number): Producer<number, Array<number>>;

export function range(
  ...args: ReadonlyArray<unknown>
): DoProduceResult<number, Array<number>> {
  return doProduce(rangeImplementation, args, args.length === 2);
}

function* rangeImplementation(
  start: number,
  end: number | undefined,
): Iterable<number> {
  end ??= Infinity;
  for (let i = start; i < end; i++) {
    yield i;
  }
}
