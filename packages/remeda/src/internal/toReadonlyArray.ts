import { isArray } from "../isArray";

/**
 * Converts `input` to an array, either by returning the input if it is already
 * an array, or by spreading it into an array.  The result is returned as a
 * `ReadonlyArray`.
 */
export function toReadonlyArray<T>(input: Iterable<T>): ReadonlyArray<T> {
  return toArray(input).array;
}

/**
 * Converts `input` to an array, either by returning the input if it is already
 * an array, or by spreading it into an array, and returns a flag indicating
 * whether the result is a copy (and therefore writable).
 */
export function toArray<T>(
  input: Iterable<T>,
):
  | { isCopy: true; array: Array<T> }
  | { isCopy: false; array: ReadonlyArray<T> } {
  return isArray(input)
    ? { isCopy: false, array: input }
    : { isCopy: true, array: [...input] };
}
