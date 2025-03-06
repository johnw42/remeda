import type {
  DataLastTransducerFunc,
  EagerTransducerImpl,
  LazyTransducerImpl,
} from "./types/LazyFunc";

/**
 * Use this helper function to build the data last implementation together with
 * a lazy implementation. Use this when you need to build your own purrying
 * logic when you want to decide between dataFirst and dataLast on something
 * that isn't the number of arguments provided. This is useful for implementing
 * functions with optional or variadic arguments.
 */
export function lazyDataLastImpl<
  Data,
  Rest extends ReadonlyArray<unknown>,
  Result,
>(
  eager: EagerTransducerImpl<Data, Rest, Result>,
  args: ReadonlyArray<unknown>,
  lazy?: LazyTransducerImpl<Data, Rest, Result>,
): DataLastTransducerFunc<Data, Result> {
  const dataLast: DataLastTransducerFunc<Data, Result> = (data) =>
    eager(data, ...(args as Rest));

  return lazy === undefined
    ? dataLast
    : Object.assign(dataLast, {
        lazy: lazy(...(args as Rest)),
        lazyKind: "transducer",
      });
}
