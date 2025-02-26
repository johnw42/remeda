/* eslint-disable @typescript-eslint/unified-signatures */
import { purry } from "./purry";

/**
 * Ensures the value is an array. If the value is not an array, an error is thrown with the provided message.
 *
 * @param value - The value to ensure.
 * @signature
 *   R.ensureArray(value, message)
 * @example
 *   R.ensureArray([1, 2, 3]) // => [1, 2, 3]
 *   R.ensureArray(5) // => throws TypeError("Value is not an array")
 * @dataFirst
 * @category Assertions
 */
export function ensureArray<T>(value: Iterable<T>): Array<T>;
export function ensureArray<T>(value: unknown): Array<T>;
export function ensureArray<T>(): {
  (value: Iterable<T>): Array<T>;
  (value: unknown): Array<T>;
};
export function ensureArray(...args: ReadonlyArray<unknown>): unknown {
  return purry(ensureArrayImplementation, args);
}

function ensureArrayImplementation<T>(value: unknown): Array<T> {
  if (!Array.isArray(value)) {
    throw new TypeError("Value is not an array");
  }
  return value as Array<T>;
}
