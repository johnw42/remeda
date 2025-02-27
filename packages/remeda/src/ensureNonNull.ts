import { purry } from "./purry";

/**
 * Ensures that the given value is not null. If the value is null, it throws an error with the provided message.
 *
 * @param value - The value to ensure.
 * @param message - The message to throw if the value is null.
 * @returns The value if it is not null.
 * @signature
 *   R.ensureNonNull(value, message)
 * @example
 *   R.ensureNonNull(5) // => 5
 *   R.ensureNonNull(null) // => throws Error("Value is null")
 * @category Assertions
 */

export function ensureNonNull<T>(value: T | null): T;
export function ensureNonNull<T>(): (value: T | null) => T;
export function ensureNonNull(...args: ReadonlyArray<unknown>): unknown {
  return purry(ensureNonNullImplementation, args);
}
function ensureNonNullImplementation<T>(value: T | null): T {
  if (value === null) {
    throw new Error("Value is null");
  }
  return value;
}
