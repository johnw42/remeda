import type { IterableElement } from "type-fest";

type ArrayToIterable<T extends Array<unknown>> = Iterable<IterableElement<T>>;

export default ArrayToIterable;
