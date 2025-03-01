import type { EnsureOpts } from "./types/EnsureOpts";

export function handleEnsureError<T, R>(
  value: T,
  opts: EnsureOpts<T, R> | undefined,
  defaultMessage: string,
): R {
  if (opts !== undefined && "default" in opts) {
    return opts.default;
  }
  let message: string = defaultMessage;
  if (opts !== undefined && "message" in opts) {
    message =
      typeof opts.message === "function" ? opts.message(value) : opts.message;
  }
  throw new Error(message);
}
