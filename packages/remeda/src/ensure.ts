import { handleEnsureError } from "./internal/handleEnsureError";
import type { EnsureOpts } from "./internal/types/EnsureOpts";

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

/**
 * Tests a condition on a given value.
 *
 * Four kinds of tests can be performed:
 * - If `opts.test` is a function, tests that it that returns true on the value.
 * - If `opts.not` is a function, tests that it that returns false on the value.
 * - If `opts.type` is a string, tests that the value has the given type using `typeof`.
 *
 * By by passing one of the `is*` functions from Remeda, you can construct a wide variety of tests.
 *
 * If the test succeeds, the value is returned.
 *
 * If the test fails, one of four things can happen:
 * - If `"default" in opts`, the default value is returned.
 * - If `opts.message` is a string, an error is thrown with the provided message.
 * - If `opts.message` is a function, an error is thrown with the message returned by calling the function with the tested value.
 * - If neither a default value nor a message is provided, an error is thrown with a default message.
 *
 * @param value - The value to ensure.
 * @param predicate - The test to perform on the value.
 * @param opts - Options for testing and handling test failures.
 * @signature
 *   R.ensure(value, predicate);
 *   R.ensure(value, predicate, opts);
 *   R.ensure(value, { test: predicate });
 *   R.ensure(value, { test: predicate, default: defaultValue });
 *   R.ensure(value, { test: predicate, message: message });
 *   R.ensure(value, { test: predicate, message: (value) => message });
 *   R.ensure(value, { not: predicate });
 *   R.ensure(value, { type: typename });
 * @example
 *   R.ensure(5, x => x > 0) // => 5
 *   R.ensure(5, { test: x => x > 0 }) // => 5
 *   R.ensure(5, { test: x => x < 0, default: 0 }) // => 0
 *   R.ensure(5, { test: x => x < 0, message: "oops" }) // => throws Error("oops")
 *   R.ensure(5, { test: x => x < 0, message: (x) => `Invalid value: ${x}` }) // => throws Error("Invalid value: 5")
 *   R.ensure(5, { test: x => x < 0 }) // => throws Error("Invalid value")
 *   R.ensure(5, { not: x => x < 0 }) // => 5
 *   R.ensure(5, { type: "number" }) // => 5
 * @dataFirst
 * @category Assertions
 */
export function ensure<T, R extends T>(
  value: T,
  predicate: EnsureOpts<T, R> &
    (((value: T) => value is R) | ((value: T) => boolean)),
  opts?: EnsureOpts<T, R>,
): R;
export function ensure<T, R extends T>(
  value: T,
  opts: EnsureOpts<T, R> &
    (
      | {
          readonly test: (value: T) => value is R;
        }
      | {
          readonly test: (value: T) => boolean;
        }
    ),
): R;
export function ensure<T>(
  value: T,
  opts: EnsureOpts<T> & {
    readonly not: (value: T) => boolean;
  },
): T;
export function ensure<T extends keyof PrimitiveTypes>(
  value: unknown,
  opts: EnsureOpts<unknown> & {
    readonly type: T;
  },
): PrimitiveTypes[T];

/**
 * Ensures the predicate is true for the given value.  Refer to the dataFirst signature for more details.
 *
 * @param predicate - The test to perform on the value.
 * @param opts - Options for testing and handling test failures.
 * @signature
 *   R.ensure(predicate)(value);
 *   R.ensure({ test: predicate })(value);
 *   R.ensure({ test: predicate, default: defaultValue })(value);
 *   R.ensure({ test: predicate, message: message })(value);
 *   R.ensure({ test: predicate, message: (value) => message })(value);
 *   R.ensure({ not: predicate })(value);
 *   R.ensure({ type: typename })(value);
 * @example
 *   R.ensure({ test: x => x > 0 })(5) // => 5
 *   R.ensure({ test: x => x < 0 })(5) // => throws Error("Invalid value")
 * @dataLast
 * @category Assertions
 */
export function ensure<T, R extends T>(
  predicate: EnsureOpts<T, R> &
    (((value: T) => value is R) | ((value: T) => boolean)),
  opts?: EnsureOpts<T, R>,
): (value: T) => R;
export function ensure<T, R extends T>(
  opts: EnsureOpts<T, R> &
    (
      | {
          readonly test: (value: T) => value is R;
        }
      | {
          readonly test: (value: T) => boolean;
        }
    ),
): (value: T) => R;
export function ensure<T>(
  opts: EnsureOpts<T> & {
    readonly not: (value: T) => boolean;
  },
): (value: T) => T;
export function ensure<T extends keyof PrimitiveTypes>(
  opts: EnsureOpts<unknown> & {
    readonly type: T;
  },
): (value: unknown) => PrimitiveTypes[T];

export function ensure(...args: ReadonlyArray<unknown>): unknown {
  return args.length === 1
    ? // @ts-expect-error This doesn't type check.
      (data: unknown) => ensureImplementation(data, args[0])
    : // @ts-expect-error This doesn't type check.
      ensureImplementation(...args);
}

function ensureImplementation<T, R extends T>(
  value: T,
  optsOrTest: EnsureOpts<T, R> &
    (
      | ((value: T) => boolean)
      | { readonly test: (value: T) => boolean }
      | { readonly not: (value: T) => boolean }
      | { readonly type: keyof PrimitiveTypes }
    ),
  opts?: EnsureOpts<T, R>,
): R {
  if (
    (typeof optsOrTest === "function" && !optsOrTest(value)) ||
    ("test" in optsOrTest && !optsOrTest.test(value)) ||
    ("not" in optsOrTest && optsOrTest.not(value)) ||
    ("type" in optsOrTest && typeof value !== optsOrTest.type)
  ) {
    return handleEnsureError(value, opts ?? optsOrTest, "Invalid value");
  }
  return value as R;
}
