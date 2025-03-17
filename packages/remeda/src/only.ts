import type { IterableElement } from "type-fest";
import type AnyIterable from "./internal/types/AnyIterable";
import doReduce, { type DoReduceResult } from "./internal/doReduce";
import type { Reducer } from "./internal/types/LazyEffect";
import { isArray } from "./isArray";

type Only<T extends AnyIterable> = T extends
  | readonly [...Array<unknown>, unknown, unknown]
  | readonly []
  | readonly [unknown, ...Array<unknown>, unknown]
  | readonly [unknown, unknown, ...Array<unknown>]
  ? undefined
  : T extends readonly [unknown]
    ? T[number]
    : IterableElement<T> | undefined;

/**
 * Returns the first and only element of `data`, or undefined otherwise.
 *
 * @param data - The target data.
 * @signature
 *    R.only(data)
 * @example
 *    R.only([]) // => undefined
 *    R.only([1]) // => 1
 *    R.only([1, 2]) // => undefined
 * @dataFirst
 * @category Array
 */
export function only<T extends AnyIterable>(data: T): Only<T>;

/**
 * Returns the first and only element of `data`, or undefined otherwise.
 *
 * @signature
 *    R.only()(data)
 * @example
 *    R.pipe([], R.only()); // => undefined
 *    R.pipe([1], R.only()); // => 1
 *    R.pipe([1, 2], R.only()); // => undefined
 * @dataLast
 * @category Array
 */
export function only<T extends AnyIterable>(): Reducer<T, Only<T>>;

export function only(...args: ReadonlyArray<unknown>): DoReduceResult {
  return doReduce(onlyImplementation, args);
}

function onlyImplementation<T>(data: Iterable<T>): T | undefined {
  if (!isArray(data)) {
    let isFirst = true;
    let firstItem: T | undefined;
    for (const item of data) {
      if (isFirst) {
        firstItem = item;
      } else {
        return undefined;
      }
      isFirst = false;
    }
    return firstItem;
  }

  return data.length === 1 ? data[0] : undefined;
}
