type EnsureOptsElse<Input, Else> = {
  readonly else: Else | ((value: Input) => Else);
};

type EnsureOptsNotElse<Input> = {
  readonly message?: string | ((value: Input) => string);
};

export type EnsureOpts<Input, Else = never> =
  | EnsureOptsNotElse<Input>
  | EnsureOptsElse<Input, Else>;

export default EnsureOpts;
