import { isPlainObject } from "./isPlainObject";
import { purry } from "./purry";

/**
 * Ensures the value is a plain object. If the value is not a plain object, an error is thrown with the provided message.
 *
 * @param value - The value to ensure.
 * @signature
 *   R.ensurePlainObject(value, message)
 * @example
 *   R.ensurePlainObject({}) // => {}
 *   R.ensurePlainObject([]) // => throws TypeError("Value is not a plain object")
 * @dataFirst
 * @category Assertions
 */
export function ensurePlainObject<T>(value: T): T & object;
export function ensurePlainObject<T>(): (value: T) => T & object;
export function ensurePlainObject(...args: ReadonlyArray<unknown>): unknown {
  return purry(ensurePlainObjectImplementation, args);
}

function ensurePlainObjectImplementation<T>(value: T): T {
  if (!isPlainObject(value)) {
    throw new TypeError("Value is not a plain object");
  }
  return value;
}
