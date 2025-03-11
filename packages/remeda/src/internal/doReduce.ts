import type { EagerReducer, ReducerImpl } from "./types/LazyFunc";

export default function doReduce<
  Data,
  Rest extends ReadonlyArray<unknown>,
  Result,
>(
  impl: ReducerImpl<Data, Rest, Result>,
  args: ReadonlyArray<unknown>,
): unknown {
  switch (impl.length - args.length) {
    case 0:
      return impl(...(args as readonly [ReadonlyArray<Data>, ...Rest]));
    case 1: {
      const dataLast: EagerReducer<Data, Result> = (data) =>
        impl(data, ...(args as Rest));
      return Object.assign(dataLast, {
        lazyKind: "reducer",
      });
    }
    default:
      throw new Error("Wrong number of arguments");
  }
}
