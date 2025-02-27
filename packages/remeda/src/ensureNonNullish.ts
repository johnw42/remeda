import { purry } from "./purry";

/**
 * Ensures that the given value is not null. If the value is null, it throws an error with the provided message.
 *
 * @param value - The value to ensure.
 * @param message - The message to throw if the value is null.
 * @returns The value if it is not null.
 * @signature
 *   R.ensureNonNullish(value, message)
 * @example
 *   R.ensureNonNullish(5) // => 5
 *   R.ensureNonNullish(null) // => throws Error("Value is nullish")
 *   R.ensureNonNullish(undefined) // => throws Error("Value is nullish")
 * @category Assertions
 */

export function ensureNonNullish<T>(value: T | null): T;
export function ensureNonNullish<T>(): (value: T | null) => T;
export function ensureNonNullish(...args: ReadonlyArray<unknown>): unknown {
  return purry(ensureNonNullishImplementation, args);
}
function ensureNonNullishImplementation<T>(value: T | null): T {
  // eslint-disable-next-line eqeqeq
  if (value == undefined) {
    throw new Error("Value is nullish");
  }
  return value;
}
