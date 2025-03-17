import type AnyIterable from "./types/AnyIterable";
import {
  lazyKind,
  type EagerReducer,
  type Reducer,
  type ReducerImpl,
} from "./types/LazyEffect";

/**
 * This function is almost identical to {@link purry}, but it is used to make a reducer function compatible with {@link pipe}'s lazy optimization.
 */
export default function doReduce<
  Data extends Iterable<unknown>,
  Rest extends ReadonlyArray<unknown>,
  Result,
>(
  impl: ReducerImpl<Data, Rest, Result>,
  args: ReadonlyArray<unknown>,
): DoReduceResult<Data, Result> {
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
  Data extends AnyIterable = AnyIterable,
  Result = unknown,
> = Result | Reducer<Data, Result>;
