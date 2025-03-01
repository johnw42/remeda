export type EnsureOpts<T, R = T> =
  | {
      readonly message?: string | ((value: T) => string);
    }
  | {
      readonly default?: R;
    };
