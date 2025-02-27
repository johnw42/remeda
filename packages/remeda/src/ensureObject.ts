import { purry } from "./purry";

/**
 * Ensures the value is an object. If the value is not an object, an error is thrown with the provided message.
 *
 * @param value - The value to ensure.
 * @signature
 *   R.ensureObject(value, message)
 * @example
 *   R.ensureObject({}) // => {}
 *   R.ensureObject(null) // => throws TypeError("Value is not an object")
 * @dataFirst
 * @category Assertions
 */
export function ensureObject(value: unknown): object;
export function ensureObject(): (value: unknown) => object;
export function ensureObject(...args: ReadonlyArray<unknown>): unknown {
  return purry(ensureObjectImplementation, args);
}

function ensureObjectImplementation(value: unknown): object {
  if (typeof value !== "object" || value === null) {
    throw new TypeError("Value is not an object");
  }
  return value;
}
