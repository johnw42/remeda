import type { ArrayValues, EmptyObject, NonEmptyTuple } from "type-fest";
import { isEmpty } from "./isEmpty";
import { purry } from "./purry";

/**
 * Ensures the value is not empty. If the value is empty, an error is thrown with the provided message.
 *
 * @param value - The value to ensure.
 * @signature
 *   R.ensureNonEmpty(value, message)
 * @example
 *   R.ensureNonEmpty(undefined) // => throws Error("Value is empty")
 *   R.ensureNonEmpty("") // => throws Error("Value is empty")
 *   R.ensureNonEmpty([]) // => throws Error("Value is empty")
 *   R.ensureNonEmpty({}) // => throws Error("Value is empty")
 *   R.ensureNonEmpty([1, 2, 3]) // => [1, 2, 3]
 *   R.ensureNonEmpty("test") // => "test"
 *   R.ensureNonEmpty({ length: 0 }) // => { length: 0 }
 * @dataFirst
 * @category Assertions
 */
export function ensureNonEmpty(
  value:
    | readonly []
    | ""
    | Readonly<EmptyObject>
    | ReadonlyMap<unknown, unknown>
    | ReadonlySet<unknown>
    | undefined,
): never;
export function ensureNonEmpty<T extends Array<unknown>>(
  value: T | undefined,
): NonEmptyTuple<ArrayValues<T>>;
export function ensureNonEmpty<T extends ReadonlyArray<unknown>>(
  value: T | undefined,
): T extends readonly [] ? never : Readonly<NonEmptyTuple<ArrayValues<T>>>;
export function ensureNonEmpty<T extends string | object>(
  value: T | undefined,
): T;
export function ensureNonEmpty<T extends Array<unknown>>(): (
  value: T | undefined,
) => NonEmptyTuple<ArrayValues<T>>;
export function ensureNonEmpty<T extends ReadonlyArray<unknown>>(): (
  value: T | undefined,
) => Readonly<NonEmptyTuple<ArrayValues<T>>>;
export function ensureNonEmpty<T extends string | object>(): (
  value: T | undefined,
) => T;
export function ensureNonEmpty(...args: ReadonlyArray<unknown>): unknown {
  return purry(ensureNonEmptyImplementation, args);
}

function ensureNonEmptyImplementation<T extends string | object>(
  value: T | undefined,
): T {
  // A cast is necessary here because no single overload of `isEmpty` accepts all possibe types of `value`.
  if (isEmpty(value as string)) {
    throw new Error("Value is empty");
  }
  return value!;
}
