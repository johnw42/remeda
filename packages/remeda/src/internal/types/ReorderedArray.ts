import type AnyIterable from "./AnyIterable";
import type { IterableContainer } from "./IterableContainer";
import type { ToArray } from "./ToArray";

export type ReorderedArray<T extends AnyIterable> = T extends IterableContainer
  ? {
      -readonly [P in keyof T]: T[number];
    }
  : ToArray<T>;
