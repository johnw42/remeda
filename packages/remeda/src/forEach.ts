import type { Writable } from "type-fest";
import type { IterableContainer } from "./internal/types/IterableContainer";
import doTransduce, { type DoTransduceResult } from "./internal/doTransduce";
import { mapCallback } from "./internal/mapCallback";
import { toReadonlyArray } from "./internal/toReadonlyArray";
import type { ArrayMethodCallback } from "./internal/types/ArrayMethodCallback";
import type { Transducer } from "./internal/types/LazyEffect";
import type ToArray from "./internal/types/ToArray";

/**
 * Executes a provided function once for each array element. Equivalent to
 * `Array.prototype.forEach`.
 *
 * The dataLast version returns the original array (instead of not returning
 * anything (`void`)) to allow using it in a pipe. When not used in a `pipe` the
 * returned array is equal to the input array (by reference), and not a shallow
 * copy of it!
 *
 * @param data - The values that would be iterated on.
 * @param callbackfn - A function to execute for each element in the array.
 * @signature
 *    R.forEach(data, callbackfn)
 * @example
 *    R.forEach([1, 2, 3], x => {
 *      console.log(x)
 *    });
 * @dataFirst
 * @lazy
 * @category Array
 */
export function forEach<T extends Iterable<unknown>>(
  data: T,
  callbackfn: ArrayMethodCallback<T, void>,
): void;

/**
 * Executes a provided function once for each array element. Equivalent to
 * `Array.prototype.forEach`.
 *
 * The dataLast version returns the original array (instead of not returning
 * anything (`void`)) to allow using it in a pipe. The returned array is the
 * same reference as the input array, and not a shallow copy of it!
 *
 * @param callbackfn - A function to execute for each element in the array.
 * @returns The original input (not a copy).
 * @signature
 *    R.forEach(callbackfn)(data)
 * @example
 *    R.pipe(
 *      [1, 2, 3],
 *      R.forEach(x => {
 *        console.log(x)
 *      })
 *    ) // => [1, 2, 3]
 * @dataLast
 * @lazy
 * @category Array
 */
export function forEach<T extends Iterable<unknown>>(
  callbackfn: ArrayMethodCallback<T, void>,
): Transducer<T, T extends IterableContainer ? Writable<T> : ToArray<T>>;

export function forEach(...args: ReadonlyArray<unknown>): DoTransduceResult {
  return doTransduce(forEachImplementation, lazyImplementation, args);
}

function forEachImplementation<T>(
  data: Iterable<T>,
  callbackfn: (value: T, index: number, data: ReadonlyArray<T>) => void,
): Array<T> {
  // eslint-disable-next-line unicorn/no-array-for-each -- We are intentionally proxying the built in forEach, it's up to the user to decide if they want to use a for loop instead.
  toReadonlyArray(data).forEach(callbackfn);
  // @ts-expect-error [ts4104] - Because the dataFirst signature returns void this is only a problem when the dataLast function is used **outside** of a pipe; for these cases we warn the user that this is happening.
  return data;
}

function* lazyImplementation<T>(
  data: Iterable<T>,
  callbackfn: (value: T, index: number, data: ReadonlyArray<T>) => void,
): Iterable<T> {
  for (const [value] of mapCallback(data, callbackfn)) {
    yield value;
  }
}
