import type {
  DataLastProducerFunc,
  EagerProducerImpl,
  LazyProducerImpl,
  ProducerFunc,
} from "./types/LazyFunc";

export default function doProduce<
  Data,
  Rest extends ReadonlyArray<unknown>,
  Result,
>(
  eager: EagerProducerImpl<Data, Rest, Result> | undefined,
  lazy: LazyProducerImpl<Data, Rest, Result>,
  args: ReadonlyArray<unknown>,
): ProducerFunc<Data, Result> | Iterable<Result> {
  switch (lazy.length - args.length) {
    case 1: {
      const dataLast: DataLastProducerFunc<Data, Result> =
        eager === undefined
          ? (data) => runEagerly(lazy, data, args as Rest)
          : (data) => eager(data, ...(args as Rest));
      return Object.assign(dataLast, {
        lazy: (data: Data) => lazy(data, ...(args as Rest)),
        lazyKind: "producer",
      } as const);
    }
    case 0:
      if (eager === undefined) {
        const [data, ...rest] = args as [Data, ...Rest];
        return runEagerly(lazy, data, rest);
      }
      return eager(...(args as [Data, ...Rest]));
    default:
      throw new Error("Wrong number of arguments");
  }
}

function* runEagerly<Data, Rest extends ReadonlyArray<unknown>, Result>(
  lazy: LazyProducerImpl<Data, Rest, Result>,
  data: Data,
  rest: Rest,
): Iterable<Result> {
  const iter = lazy(data, ...rest);
  for (;;) {
    const { done, value } = iter();
    if (done === true) {
      return;
    }
    yield* value;
  }
}
