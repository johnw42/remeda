import { purry } from "./purry";

/**
 * Ensures the value is an instance of the provided constructor. If the value is
 * not an instance of the constructor, an error is thrown with the provided
 * message.
 *
 * @param value - The value to ensure.
 * @param constructor - The constructor to check the value against.
 * @param message - The message to throw if the value is not an instance of the
 * constructor.
 * @signature
 *   R.ensureInstance(value, constructor, message)
 * @example
 *   R.ensureInstance(new Date(), Date) // => Date instance
 *   R.ensureInstance({}, Date) // => throws TypeError("Value is not an instance of Date")
 * @dataFirst
 * @category Assertions
 */

export function ensureInstance<T>(
  value: unknown,
  constructor: new (...args: ReadonlyArray<unknown>) => T,
): T;

export function ensureInstance<T>(
  constructor: new (...args: ReadonlyArray<unknown>) => T,
): (value: unknown) => T;
export function ensureInstance(...args: ReadonlyArray<unknown>): unknown {
  return purry(ensureInstanceImplementation, args);
}
function ensureInstanceImplementation<T>(
  value: unknown,
  constructor: new (...args: ReadonlyArray<unknown>) => T,
): T {
  if (!(value instanceof constructor)) {
    throw new TypeError(`Value is not an instance of ${constructor.name}`);
  }
  return value;
}
