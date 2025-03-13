import {
  lazyKind,
  type EagerReducer,
  type Reducer,
  type ReducerImpl,
} from "./types/LazyFunc";

export default function doReduce<
  Data extends Iterable<unknown>,
  Rest extends ReadonlyArray<unknown>,
  Result,
>(
  impl: ReducerImpl<Data, Rest, Result>,
  args: ReadonlyArray<unknown>,
): Result | Reducer<Data, Result> {
  switch (impl.length - args.length) {
    case 0:
      return impl(...(args as readonly [Data, ...Rest]));
    case 1: {
      const dataLast: EagerReducer<Data, Result> = (data) =>
        impl(data, ...(args as Rest));
      return Object.assign(dataLast, {
        [lazyKind]: "reducer",
      } as const);
    }
    default:
      throw new Error("Wrong number of arguments");
  }
}

export type DoReduceResult<
  Data extends Iterable<unknown> = Iterable<unknown>,
  Result = unknown,
> = Result | Reducer<Data, Result>;
