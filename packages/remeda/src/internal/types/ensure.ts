/* eslint-disable unicorn/filename-case */
export type EnsureOptsWithElse<Data, Else> = {
  readonly else: Else | ((data: Data) => Else);
};

export type EnsureOptsWithoutElse<Data> = {
  readonly message?: string | ((data: Data) => string);
};

export type EnsureOpts<Data, Else = never> =
  | EnsureOptsWithoutElse<Data>
  | EnsureOptsWithElse<Data, Else>;

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

export type EnsureNarrowingArg<Data, Output extends Data> =
  | ((data: Data) => data is Output)
  | { readonly test: (data: Data) => data is Output };

export type EnsureBooleanArg<Data> =
  | ((data: Data) => boolean)
  | { readonly test: (data: Data) => boolean }
  | { readonly not: (data: Data) => boolean };

export type EnsureTypeArg<Key extends keyof PrimitiveTypes> = {
  readonly type: Key;
};

export type EnsureArg<Data> = (
  | EnsureOptsWithElse<Data, never>
  | EnsureOptsWithoutElse<Data>
) &
  (
    | EnsureNarrowingArg<Data, Data>
    | EnsureBooleanArg<Data>
    | EnsureTypeArg<keyof PrimitiveTypes>
  );

type EnsureResultWithoutElse<Arg extends EnsureArg<never>> =
  Arg extends EnsureNarrowingArg<never, infer Output>
    ? Output
    : Arg extends EnsureBooleanArg<never>
      ? EnsureData<Arg>
      : Arg extends EnsureTypeArg<infer Key>
        ? PrimitiveTypes[Key]
        : never;

export type EnsureData<Arg> = Arg extends EnsureArg<infer Data> ? Data : never;

export type EnsureResult<Arg extends EnsureArg<never>> =
  | EnsureResultWithoutElse<Arg>
  | (Arg extends EnsureOptsWithElse<EnsureData<Arg>, infer Else>
      ? Else
      : never);
