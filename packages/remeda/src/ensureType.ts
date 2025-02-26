import { purry } from "./purry";

/**
 * Ensures the value is of the provided type. If the value is not of the
 * provided type, an error is thrown with the provided message.
 *
 * @param value - The value to ensure.
 * @param type - The type to check the value against.
 * @param message - The message to throw if the value is not of the provided
 * type.
 * @signature
 *   R.ensureType(value, type, message)
 * @example
 *   R.ensureType(5, "number") // => 5
 *   R.ensureType(5, "string") // => throws TypeError("Value is not of type string")
 * @dataFirst
 * @category Assertions
 */

export function ensureType<K extends keyof PrimitiveTypes>(
  value: unknown,
  type: K,
): PrimitiveTypes[K];
export function ensureType<K extends keyof PrimitiveTypes>(
  type: K,
): (value: unknown) => PrimitiveTypes[K];
export function ensureType(...args: ReadonlyArray<unknown>): unknown {
  return purry(ensureTypeImplementation, args);
}
type PrimitiveTypes = {
  string: string;
  number: number;
  bigint: bigint;
  boolean: boolean;
  symbol: symbol;
  undefined: undefined;
  object: object;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  function: Function;
};
function ensureTypeImplementation(value: unknown, type: string): unknown {
  if (typeof value !== type) {
    throw new TypeError(`Value is not of type ${type}`);
  }
  return value;
}
