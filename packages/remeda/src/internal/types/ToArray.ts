import type { IterableElement } from "type-fest";
import type AnyIterable from "./AnyIterable";

type ToArray<T extends AnyIterable> = Array<IterableElement<T>>;

export default ToArray;
