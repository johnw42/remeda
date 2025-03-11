import type {
  EagerTransducer,
  EagerTransducerImpl,
  LazyTransducerImpl,
  Transducer,
} from "./types/LazyFunc";
import { unsafeToArray } from "./unsafeToArray";

export default function doTransduce<
  Data,
  Rest extends ReadonlyArray<unknown>,
  Result,
>(
  eager: EagerTransducerImpl<Data, Rest, Result> | undefined,
  lazy: LazyTransducerImpl<Data, Rest, Result>,
  args: ReadonlyArray<unknown>,
  isDataFirst?: boolean,
): Array<Result> | Transducer<Data, Result> {
  eager ??= (data, ...rest) => unsafeToArray(lazy(data, ...rest));
  if (isDataFirst === undefined) {
    switch (lazy.length - args.length) {
      case 1:
        isDataFirst = false;
        break;
      case 0:
        isDataFirst = true;
        break;
      default:
        throw new Error("Wrong number of arguments");
    }
  }

  if (isDataFirst) {
    return eager(...(args as readonly [Iterable<Data>, ...Rest]));
  }

  const dataLast: EagerTransducer<Data, Result> = (data): Array<Result> =>
    eager(data, ...(args as Rest));
  return Object.assign(dataLast, {
    lazy: (data: Iterable<Data>) => lazy(data, ...(args as Rest)),
    lazyKind: "transducer",
  } as const);
}
