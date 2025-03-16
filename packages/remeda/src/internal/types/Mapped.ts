import type { IterableContainer } from "./IterableContainer";
import type ToArray from "./ToArray";

export type Mapped<T extends Iterable<unknown>, K> = [T] extends [
  IterableContainer,
]
  ? ToArray<T> & {
      -readonly [P in keyof T]: K;
    }
  : Array<K>;
