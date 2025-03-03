import { handleEnsureError } from "./internal/handleEnsureError";
import type {
  EnsureArg,
  EnsureBooleanArg,
  EnsureData,
  EnsureOpts,
  EnsureOptsWithElse,
  EnsureOptsWithoutElse,
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
 * @param opts - Options for testing and handling test failures, or a predicate function.
 * @signature
 *   R.ensure(value, predicate);
 *   R.ensure(value, { test: predicate, ...options });
 *   R.ensure(value, { not: predicate, ...options });
 *   R.ensure(value, { type: typename, ...options });
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
): EnsureResult<Data, Arg>;
// export function ensure<Input, Output extends Input, Else>(
//   value: Input,
//   opts: EnsureOptsWithElse<Input, Else> &
//     (
//       | ((value: Input) => value is Output)
//       | { readonly test: (value: Input) => value is Output }
//     ),
// ): Output | Else;
// export function ensure<Input, Output extends Input>(
//   value: Input,
//   opts: EnsureOpts<Input> &
//     (
//       | ((value: Input) => value is Output)
//       | { readonly test: (value: Input) => value is Output }
//     ),
// ): Output;
// export function ensure<Input, Else>(
//   value: Input,
//   opts: EnsureOptsWithElse<Input, Else> &
//     (
//       | ((value: Input) => boolean)
//       | { readonly test: (value: Input) => boolean }
//       | { readonly not: (value: Input) => boolean }
//     ),
// ): Input | Else;
// export function ensure<Input>(
//   value: Input,
//   opts: EnsureOpts<Input> &
//     (
//       | ((value: Input) => boolean)
//       | { readonly test: (value: Input) => boolean }
//       | { readonly not: (value: Input) => boolean }
//     ),
// ): Input;
// export function ensure<Input, Key extends keyof PrimitiveTypes, Else>(
//   value: unknown,
//   opts: EnsureOptsWithElse<Input, Else> & {
//     readonly type: Key;
//   },
// ): PrimitiveTypes[Key] | Else;
// export function ensure<Input, Key extends keyof PrimitiveTypes>(
//   value: unknown,
//   opts: EnsureOpts<Input> & {
//     readonly type: Key;
//   },
// ): PrimitiveTypes[Key];

/**
 * Ensures the predicate is true for the given value.  Refer to the dataFirst signature for more details.
 *
 * @param opts - Options for testing and handling test failures, or a predicate function.
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
export function ensure<Arg extends EnsureArg<never>>(
  opts: Arg,
): <Data>(data: Data) => EnsureResult<Data, Arg>;
// export function ensure<Input, Output extends Input, Else>(
//   opts: EnsureOptsWithElse<Input, Else> &
//     (
//       | ((value: Input) => value is Output)
//       | { readonly test: (value: Input) => value is Output }
//     ),
// ): (value: Input) => Output | Else;
// export function ensure<Input, Output extends Input>(
//   opts: EnsureOpts<Input> &
//     (
//       | ((value: Input) => value is Output)
//       | { readonly test: (value: Input) => value is Output }
//     ),
// ): (value: Input) => Output;
// export function ensure<Input, Else>(
//   opts: EnsureOptsWithElse<Input, Else> &
//     (
//       | ((value: Input) => boolean)
//       | { readonly test: (value: Input) => boolean }
//       | { readonly not: (value: Input) => boolean }
//     ),
// ): (value: Input) => Input | Else;
// export function ensure<Input>(
//   opts: EnsureOpts<Input> &
//     (
//       | ((value: Input) => boolean)
//       | { readonly test: (value: Input) => boolean }
//       | { readonly not: (value: Input) => boolean }
//     ),
// ): (value: Input) => Input;
// export function ensure<Key extends keyof PrimitiveTypes, Else>(
//   opts: EnsureOptsWithElse<unknown, Else> & {
//     readonly type: Key;
//   },
// ): (value: unknown) => PrimitiveTypes[Key] | Else;
// export function ensure<Key extends keyof PrimitiveTypes>(
//   opts: EnsureOpts<unknown, PrimitiveTypes[Key]> & {
//     readonly type: Key;
//   },
// ): (value: unknown) => PrimitiveTypes[Key];

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
