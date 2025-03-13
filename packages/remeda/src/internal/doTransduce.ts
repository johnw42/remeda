import {
  lazyImpl,
  lazyKind,
  type EagerTransducer,
  type EagerTransducerImpl,
  type LazyTransducerImpl,
  type Transducer,
} from "./types/LazyFunc";
import { unsafeToArray } from "./unsafeToArray";

export default function doTransduce<
  Data extends Iterable<unknown>,
  Rest extends ReadonlyArray<unknown>,
  Result extends Array<unknown>,
>(
  eager: EagerTransducerImpl<Data, Rest, Result> | undefined,
  lazy: LazyTransducerImpl<Data, Rest, Result>,
  args: ReadonlyArray<unknown>,
  isDataFirst?: boolean,
): DoTransduceResult<Data, Result> {
  eager ??= (data, ...rest) => unsafeToArray(lazy(data, ...rest)) as Result;
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
    return eager(...(args as readonly [Data, ...Rest]));
  }

  const dataLast: EagerTransducer<Data, Result> = (data): Result =>
    eager(data, ...(args as Rest));
  return Object.assign(dataLast, {
    [lazyImpl]: (data: Data) => lazy(data, ...(args as Rest)),
    [lazyKind]: "transducer",
  } as const);
}

export type DoTransduceResult<
  Data extends Iterable<unknown> = Iterable<unknown>,
  Result extends Array<unknown> = Array<unknown>,
> = Result | Transducer<Data, Result>;
