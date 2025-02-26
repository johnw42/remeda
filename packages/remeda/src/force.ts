import { purry } from "./purry";

export type Delay<T> = T | (() => T);

/**
 * Calls a function if it is a function, otherwise returns the value.
 *
 * @param value - Value or function to force.
 * @signature
 *    R.force(value)
 * @example
 *    R.force(5); // => 5
 *    R.force(() => 5); // => 5
 * @category Function
 */
export function force<T>(value: Delay<T>): T;
export function force<T>(): (value: Delay<T>) => T;

export function force(...args: ReadonlyArray<unknown>): unknown {
  return purry(forceImpl, args);
}

function forceImpl<T>(value: Delay<T>): T {
  return typeof value === "function" ? (value as () => T)() : value;
}
