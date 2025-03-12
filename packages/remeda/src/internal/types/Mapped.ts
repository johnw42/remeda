import type { IterableContainer } from "./IterableContainer";

export type Mapped<T extends Iterable<unknown>, K> = [T] extends [
  IterableContainer,
]
  ? {
      -readonly [P in keyof T]: K;
    }
  : Iterable<K>;

// export type Mapped<T extends IterableContainer, K> = {
//   -readonly [P in keyof T]: K;
// };
