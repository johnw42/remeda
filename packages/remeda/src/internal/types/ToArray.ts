import type { IterableElement } from "type-fest";

type ToArray<T extends Iterable<unknown>> = Array<IterableElement<T>>;

export default ToArray;
