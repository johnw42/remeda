export type EnsureOptsWithElse<Input, Else> = {
  readonly else: Else | ((value: Input) => Else);
};

export type EnsureOptsWithoutElse<Input> = {
  readonly message?: string | ((value: Input) => string);
};

export type EnsureOpts<Input, Else = never> =
  | EnsureOptsWithoutElse<Input>
  | EnsureOptsWithElse<Input, Else>;

export default EnsureOpts;
