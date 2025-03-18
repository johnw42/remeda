import type { IfAny, IterableElement, Writable } from "type-fest";
import type AnyIterable from "./AnyIterable";

type ToArray<T extends AnyIterable> = IfAny<
  IterableElement<T>,
  Array<unknown>,
  T extends ReadonlyArray<unknown> ? Writable<T> : ToNonTupleArray<T>
>;

export type ToNonTupleArray<T extends AnyIterable> = Array<IterableElement<T>>;

export default ToArray;
