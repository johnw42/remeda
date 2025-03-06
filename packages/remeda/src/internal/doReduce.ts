import type {
  DataLastReducerFunc,
  EagerReducerImpl,
  LazyReducerImpl,
} from "./types/LazyFunc";

export default function doReduce<
  Data,
  Rest extends ReadonlyArray<unknown>,
  Result,
>(
  eager: EagerReducerImpl<Data, Rest, Result>,
  lazy: LazyReducerImpl<Data, Rest, Result>,
  args: ReadonlyArray<unknown>,
): unknown {
  switch (eager.length - args.length) {
    case 0:
      return eager(...(args as readonly [ReadonlyArray<Data>, ...Rest]));
    case 1: {
      const dataLast: DataLastReducerFunc<Data, Result> = (data) =>
        eager(data, ...(args as Rest));
      return Object.assign(dataLast, {
        lazy: lazy(...(args as Rest)),
        lazyKind: "reducer",
      });
    }
    default:
      throw new Error("Wrong number of arguments");
  }
}
