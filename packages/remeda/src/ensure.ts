import { purry } from "./purry";

/**
 * Ensures the predicate is true for the value.
 * If the predicate is false, an error is thrown with the provided message.
 *
 * @param value - The value to ensure.
 * @param predicate - The predicate to check the value against.
 * @signature
 *   R.ensure(value, predicate, message)
 * @example
 *   R.ensure(5, x => x > 0) // => 5
 *   R.ensure(5, x => x < 0) // => throws Error("Invalid value")
 * @dataFirst
 * @category Assertions
 */
export function ensure<Wide, Narrow extends Wide>(
  value: Wide,
  predicate: (value: Wide) => value is Narrow,
): Narrow;
export function ensure<T>(value: T, predicate: (value: T) => boolean): T;

/**
 * Ensures the predicate is true for the value.
 * If the predicate is false, an error is thrown with the provided message.
 *
 * @param predicate - The predicate to check the value against.
 * @signature
 *   R.ensure(predicate, message)(value)
 * @example
 *  R.ensure(x => x > 0)("Invalid value")(5) // => 5
 *  R.ensure(x => x < 0)("Invalid value")(5) // => throws Error("Invalid value")
 * @dataLast
 * @category Assertions
 */
export function ensure<Wide, Narrow extends Wide>(
  predicate: (value: Wide) => value is Narrow,
): (value: Wide) => Narrow;
export function ensure<T>(predicate: (value: T) => boolean): (value: T) => T;

export function ensure(...args: ReadonlyArray<unknown>): unknown {
  return purry(ensureImplementation, args);
}

export function ensureImplementation<T>(
  value: T,
  predicate: (value: T) => boolean,
): T {
  if (!predicate(value)) {
    throw new Error("Invalid value");
  }
  return value;
}
