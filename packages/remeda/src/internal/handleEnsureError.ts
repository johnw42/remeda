import type { EnsureOpts } from "./types/ensure";

export function handleEnsureError<Data, Output>(
  value: Data,
  opts: EnsureOpts<Data, Output> | ((value: Data) => boolean),
  defaultMessage: string,
): Data | Output {
  let message: string = defaultMessage;
  if (typeof opts !== "function") {
    if ("message" in opts) {
      message =
        typeof opts.message === "function" ? opts.message(value) : opts.message;
    } else if ("else" in opts) {
      return typeof opts.else === "function"
        ? (opts.else as (value: Data) => Output)(value)
        : opts.else;
    }
  }
  throw new Error(message);
}
