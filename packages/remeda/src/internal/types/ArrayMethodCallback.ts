import type { IterableElement } from "type-fest";
import type { IterableContainer } from "./IterableContainer";

export type ArrayMethodCallback<T extends Iterable<unknown>, R = unknown> = (
  item: IterableElement<T>,
  index: number,
  data: ArrayMethodCallbackDataArg<T>,
) => R;

export type ArrayMethodTypePredicate<
  T extends Iterable<unknown>,
  R extends IterableElement<T>,
> = (
  item: IterableElement<T>,
  index: number,
  data: ArrayMethodCallbackDataArg<T>,
) => item is R;

export type ArrayMethodCallbackWithExtraArg<
  E,
  T extends Iterable<unknown>,
  R = unknown,
> = (
  extra: E,
  item: IterableElement<T>,
  index: number,
  data: ArrayMethodCallbackDataArg<T>,
) => R;

type ArrayMethodCallbackDataArg<T extends Iterable<unknown>> = [T] extends [
  IterableContainer,
]
  ? T
  : ReadonlyArray<IterableElement<T>>;
