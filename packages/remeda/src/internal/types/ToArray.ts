import type { IfAny, IterableElement, Writable } from "type-fest";
import type AnyIterable from "./AnyIterable";

type ToArray<T extends AnyIterable> = IfAny<
  IterableElement<T>,
  Array<unknown>,
  T extends ReadonlyArray<unknown> ? Writable<T> : Array<IterableElement<T>>
>;

export default ToArray;
