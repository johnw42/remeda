import type { IterableElement } from "type-fest";
import type { IterableContainer } from "./IterableContainer";

export type Mapped<T extends IterableContainer, K> = Array<
  IterableElement<T>
> & {
  -readonly [P in keyof T]: K;
};
