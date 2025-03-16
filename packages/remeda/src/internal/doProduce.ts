import {
  lazyImpl,
  lazyKind,
  type EagerProducer,
  type Producer,
  type LazyProducerImpl,
} from "./types/LazyFunc";
import { unsafeToArray } from "./unsafeToArray";

export default function doProduce<
  Data,
  Rest extends ReadonlyArray<unknown>,
  Result extends Array<unknown>,
>(
  impl: LazyProducerImpl<Data, Rest, Result>,
  args: ReadonlyArray<unknown>,
): DoProduceResult<Data, Result> {
  switch (impl.length - args.length) {
    case 1: {
      const dataLast: EagerProducer<Data, Result> = (data) =>
        unsafeToArray(impl(data, ...(args as Rest)) as Result);
      return Object.assign(dataLast, {
        [lazyImpl]: (data: Data) => impl(data, ...(args as Rest)),
        [lazyKind]: "producer",
      } as const);
    }
    case 0:
      return unsafeToArray(impl(...(args as [Data, ...Rest]))) as Result;
    default:
      throw new Error("Wrong number of arguments");
  }
}

export type DoProduceResult<
  Data = unknown,
  Result extends Array<unknown> = Array<unknown>,
> = Result | Producer<Data, Result>;
