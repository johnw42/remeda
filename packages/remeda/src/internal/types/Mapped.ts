import type { IterableElement } from "type-fest";
import type { IterableContainer } from "./IterableContainer";

export type Mapped<T extends Iterable<unknown>, K> = [T] extends [
  IterableContainer,
]
  ? Array<IterableElement<T>> & {
      -readonly [P in keyof T]: K;
    }
  : Array<K>;
