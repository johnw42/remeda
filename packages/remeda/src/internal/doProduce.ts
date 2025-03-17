import {
  lazyImpl,
  lazyKind,
  type EagerProducer,
  type Producer,
  type LazyProducerImpl,
} from "./types/LazyEffect";
import { unsafeToArray } from "./unsafeToArray";

/**
 * This function is almost identical to {@link purry}, but it is used to make a
 * producer function compatible with {@link pipe}'s lazy optimization.
 */
export default function doProduce<
  Data,
  Rest extends ReadonlyArray<unknown>,
  Result extends Array<unknown>,
>(
  impl: LazyProducerImpl<Data, Rest, Result>,
  args: ReadonlyArray<unknown>,
): DoProduceResult<Data, Result> {
  switch (impl.length - args.length) {
    case 0:
      return unsafeToArray(impl(...(args as [Data, ...Rest]))) as Result;
    case 1: {
      const dataLast: EagerProducer<Data, Result> = (data) =>
        unsafeToArray(impl(data, ...(args as Rest)) as Result);
      return Object.assign(dataLast, {
        [lazyImpl]: (data: Data) => impl(data, ...(args as Rest)),
        [lazyKind]: "producer",
      } as const);
    }
    default:
      throw new Error("Wrong number of arguments");
  }
}

/**
 * This type is used to ensure that a data-last signature that returns a
 * {@link Producer} matches the type of the implementation.
 */
export type DoProduceResult<
  Data = unknown,
  Result extends Array<unknown> = Array<unknown>,
> = Result | Producer<Data, Result>;
