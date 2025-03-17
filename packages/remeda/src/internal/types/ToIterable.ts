import type { IterableElement } from "type-fest";

type ToIterable<T extends Iterable<unknown>> = Iterable<IterableElement<T>>;

export default ToIterable;
