import type { IterableElement } from "type-fest";
import type { IterableContainer } from "./IterableContainer";
import type AnyIterable from "./AnyIterable";

export type ArrayMethodCallback<T extends AnyIterable, R = unknown> = (
  item: IterableElement<T>,
  index: number,
  data: ArrayMethodCallbackDataArg<T>,
) => R;

export type ArrayMethodTypePredicate<
  T extends AnyIterable,
  R extends IterableElement<T>,
> = (
  item: IterableElement<T>,
  index: number,
  data: ArrayMethodCallbackDataArg<T>,
) => item is R;

export type ArrayMethodCallbackWithExtraArg<
  E,
  T extends AnyIterable,
  R = unknown,
> = (
  extra: E,
  item: IterableElement<T>,
  index: number,
  data: ArrayMethodCallbackDataArg<T>,
) => R;

type ArrayMethodCallbackDataArg<T extends AnyIterable> =
  T extends IterableContainer ? T : ReadonlyArray<IterableElement<T>>;
