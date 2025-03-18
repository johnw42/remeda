import type { IfAny, IterableElement, Writable } from "type-fest";
import type AnyIterable from "./AnyIterable";

export type ToArrayOrTuple<T extends AnyIterable> = IfAny<
  IterableElement<T>,
  Array<unknown>,
  T extends ReadonlyArray<unknown> ? Writable<T> : ToArray<T>
>;

export type ToArray<T extends AnyIterable> = Array<IterableElement<T>>;
