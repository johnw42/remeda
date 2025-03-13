import {
  lazyImpl,
  lazyKind,
  type EagerProducer,
  type Producer,
  type ProducerImpl,
} from "./types/LazyFunc";
import { unsafeToArray } from "./unsafeToArray";

export default function doProduce<
  Data,
  Rest extends ReadonlyArray<unknown>,
  Result,
>(
  impl: ProducerImpl<Data, Rest, Result>,
  args: ReadonlyArray<unknown>,
): Array<Result> | Producer<Data, Result> {
  switch (impl.length - args.length) {
    case 1: {
      const dataLast: EagerProducer<Data, Result> = (data) =>
        unsafeToArray(impl(data, ...(args as Rest)));
      return Object.assign(dataLast, {
        [lazyImpl]: (data: Data) => impl(data, ...(args as Rest)),
        [lazyKind]: "producer",
      } as const);
    }
    case 0:
      return unsafeToArray(impl(...(args as [Data, ...Rest])));
    default:
      throw new Error("Wrong number of arguments");
  }
}
