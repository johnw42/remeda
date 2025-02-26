import { purry } from "./purry";

/**
 * Ensures that the given value is not truthy. If the value is not truthy, it throws an error with the provided message.
 *
 * @param value - The value to ensure.
 * @returns The value if it is truthy.
 * @signature
 *   R.ensureTruthy(value, message)
 * @example
 *  R.ensureTruthy(5) // => 5
 *  R.ensureTruthy(0) // => throws Error("Value is not truthy")
 * @category Assertions
 */
export function ensureTruthy<T>(value: T): T;
export function ensureTruthy<T>(): (value: T) => T;
export function ensureTruthy(...args: ReadonlyArray<unknown>): unknown {
  return purry(ensureTruthyImplementation, args);
}

function ensureTruthyImplementation<T>(value: T): T {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!value) {
    throw new Error("Value is not truthy");
  }
  return value;
}
