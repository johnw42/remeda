import { handleEnsureError } from "./internal/handleEnsureError";
import type {
  EnsureArg,
  EnsureOpts,
  EnsureResult,
} from "./internal/types/ensure";

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
 * Tests a condition on a given data value.
 *
 * Four kinds of tests can be performed:
 * - If `opts.test` is a function, tests that it that returns true on the data.
 * - If `opts.not` is a function, tests that it that returns false on the data.
 * - If `opts.type` is a string, tests that the data has the given type using `typeof`.
 *
 * By by passing one of the `is*` functions from Remeda, you can construct a wide variety of tests.
 *
 * If the test succeeds, `data` is returned.
 *
 * If the test fails, one of four things can happen:
 * - If `opts.else` is a function, returns `opts.else(data)`.
 * - If `opts.else` is a non-function, returns `opts.else`.
 * - If `opts.message` is a string, an error is thrown with the provided message.
 * - If `opts.message` is a function, an error is thrown with the message `opts.message(data)`.
 * - If neither `else` nor `message` is provided, an error is thrown with a default message.
 *
 * @param data - The data to check.
 * @param opts - Options for testing and handling test failures, or a predicate function.
 * @signature
 *   R.ensure(data, predicate);
 *   R.ensure(data, { test: predicate, ...options });
 *   R.ensure(data, { not: predicate, ...options });
 *   R.ensure(data, { type: typename, ...options });
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
export function ensure<Data, Arg extends EnsureArg<Data>>(
  data: Data,
  opts: Arg,
): EnsureResult<Arg>;

/**
 * Tests a condition on a given data value.
 * Refer to the data-first signature for more details.
 *
 * @param opts - Options for testing and handling test failures, or a predicate function.
 * @signature
 *   R.ensure(predicate)(data);
 *   R.ensure({ test: predicate, ...options })(data);
 *   R.ensure({ not: predicate, ...options })(data);
 *   R.ensure({ type: typename, ...options })(data);
 * @example
 *   R.ensure({ test: x => x > 0 })(5) // => 5
 *   R.ensure({ test: x => x < 0 })(5) // => throws Error("Invalid value")
 * @dataLast
 * @category Assertions
 */
export function ensure<Arg extends EnsureArg<never>>(
  opts: Arg,
): (data: unknown) => EnsureResult<Arg>;

export function ensure(...args: ReadonlyArray<unknown>): unknown {
  return args.length === 1
    ? // @ts-expect-error This doesn't type check.
      (data: unknown) => ensureImplementation(data, args[0])
    : // @ts-expect-error This doesn't type check.
      ensureImplementation(...args);
}

function ensureImplementation<Input, Output extends Input>(
  value: Input,
  optsOrTest: EnsureOpts<Input, Output> &
    (
      | ((value: Input) => boolean)
      | { readonly test: (value: Input) => boolean }
      | { readonly not: (value: Input) => boolean }
      | { readonly type: keyof PrimitiveTypes }
    ),
): Input | Output {
  if (
    (typeof optsOrTest === "function" && !optsOrTest(value)) ||
    ("test" in optsOrTest && !optsOrTest.test(value)) ||
    ("not" in optsOrTest && optsOrTest.not(value)) ||
    ("type" in optsOrTest && typeof value !== optsOrTest.type)
  ) {
    return handleEnsureError(value, optsOrTest, "Invalid value");
  }
  return value as Output;
}
