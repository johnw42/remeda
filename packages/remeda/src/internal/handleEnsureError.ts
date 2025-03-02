import type EnsureOpts from "./types/EnsureOpts";

export function handleEnsureError<Input, Output>(
  value: Input,
  opts: EnsureOpts<Input, Output> | ((value: Input) => boolean),
  defaultMessage: string,
): Input | Output {
  let message: string = defaultMessage;
  if (typeof opts !== "function") {
    if ("message" in opts) {
      message =
        typeof opts.message === "function" ? opts.message(value) : opts.message;
    } else if ("else" in opts) {
      return typeof opts.else === "function"
        ? (opts.else as (value: Input) => Output)(value)
        : opts.else;
    }
  }
  throw new Error(message);
}
