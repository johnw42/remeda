import type { IterableElement } from "type-fest";
import type AnyIterable from "./AnyIterable";

type ToIterable<T extends AnyIterable> = Iterable<IterableElement<T>>;

export default ToIterable;
