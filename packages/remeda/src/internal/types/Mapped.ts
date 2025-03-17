import type AnyIterable from "./AnyIterable";
import type { IterableContainer } from "./IterableContainer";
import type ToArray from "./ToArray";

export type Mapped<T extends AnyIterable, K> = [T] extends [IterableContainer]
  ? ToArray<T> & {
      -readonly [P in keyof T]: K;
    }
  : Array<K>;
