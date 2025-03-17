import type { Join as JoinArray } from "type-fest";
import doReduce, { type DoReduceResult } from "./internal/doReduce";
import type { Reducer } from "./internal/types/LazyEffect";
import { toReadonlyArray } from "./internal/toReadonlyArray";

// Copied from type-fest, from the Join type.
type JoinableItem = bigint | boolean | number | string | null | undefined;

type Join<T extends Iterable<JoinableItem>, Glue extends string> =
  T extends ReadonlyArray<JoinableItem> ? JoinArray<T, Glue> : string;

/**
 * Joins the elements of the array by: casting them to a string and
 * concatenating them one to the other, with the provided glue string in between
 * every two elements.
 *
 * When called on a tuple and with stricter item types (union of literal values,
 * the result is strictly typed to the tuples shape and it's item types).
 *
 * @param data - The array to join.
 * @param glue - The string to put in between every two elements.
 * @signature
 *    R.join(data, glue)
 * @example
 *    R.join([1,2,3], ",") // => "1,2,3" (typed `string`)
 *    R.join(['a','b','c'], "") // => "abc" (typed `string`)
 *    R.join(['hello', 'world'] as const, " ") // => "hello world" (typed `hello world`)
 * @dataFirst
 * @category Array
 */
export function join<T extends Iterable<JoinableItem>, Glue extends string>(
  data: T,
  glue: Glue,
): Join<T, Glue>;

/**
 * Joins the elements of the array by: casting them to a string and
 * concatenating them one to the other, with the provided glue string in between
 * every two elements.
 *
 * When called on a tuple and with stricter item types (union of literal values,
 * the result is strictly typed to the tuples shape and it's item types).
 *
 * @param glue - The string to put in between every two elements.
 * @signature
 *    R.join(glue)(data)
 * @example
 *    R.pipe([1,2,3], R.join(",")) // => "1,2,3" (typed `string`)
 *    R.pipe(['a','b','c'], R.join("")) // => "abc" (typed `string`)
 *    R.pipe(['hello', 'world'] as const, R.join(" ")) // => "hello world" (typed `hello world`)
 * @dataLast
 * @category Array
 */
export function join<T extends Iterable<JoinableItem>, Glue extends string>(
  glue: Glue,
): Reducer<T, Join<T, Glue>>;

export function join(...args: ReadonlyArray<unknown>): DoReduceResult {
  return doReduce(joinImplementation, args);
}

const joinImplementation = (data: Iterable<unknown>, glue: string): string =>
  toReadonlyArray(data).join(glue);
