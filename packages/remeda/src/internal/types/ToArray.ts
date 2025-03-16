import type { IterableElement } from "type-fest";

type ToArray<T extends Iterable<unknown>> =
  T extends Array<unknown> ? T : Array<IterableElement<T>>;

export default ToArray;
