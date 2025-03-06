import type {
  EagerTransducerImpl,
  DataLastTransducerFunc,
  TransducerFunc,
  LazyTransducerImpl,
} from "./types/LazyFunc";

export default function transduce<
  Data,
  Rest extends ReadonlyArray<unknown>,
  Result,
>(
  eager: EagerTransducerImpl<Data, Rest, Result> | undefined,
  lazy: LazyTransducerImpl<Data, Rest, Result>,
  args: ReadonlyArray<unknown>,
): Array<Result> | TransducerFunc<Data, Result> {
  switch (args.length - lazy.length) {
    case 0: {
      const dataLast: DataLastTransducerFunc<Data, Result> =
        eager === undefined
          ? (data: ReadonlyArray<Data>) => runEagerly(lazy, data, args as Rest)
          : (data: ReadonlyArray<Data>): Array<Result> =>
              eager(data, ...(args as Rest));
      return Object.assign(dataLast, {
        lazy: lazy(...(args as Rest)),
        lazyKind: "transducer",
      }) as TransducerFunc<Data, Result>;
    }
    case 1:
      if (eager === undefined) {
        const [data, ...rest] = args as [ReadonlyArray<Data>, ...Rest];
        return runEagerly(lazy, data, rest);
      }
      return eager(...(args as readonly [ReadonlyArray<Data>, ...Rest]));
    default:
      throw new Error("Wrong number of arguments");
  }
}

function runEagerly<Data, Rest extends ReadonlyArray<unknown>, Result>(
  lazy: LazyTransducerImpl<Data, Rest, Result>,
  data: ReadonlyArray<Data>,
  rest: Rest,
): Array<Result> {
  const results: Array<Result> = [];
  const iter = lazy(...rest);
  for (const item of data) {
    const { done, value } = iter(item);
    if (done === true) {
      break;
    }
    results.push(...value);
  }
  return results;
}
