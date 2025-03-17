import type AnyIterable from "./types/AnyIterable";
import {
  lazyImpl,
  lazyKind,
  type EagerTransducer,
  type EagerTransducerImpl,
  type LazyTransducerImpl,
  type Transducer,
} from "./types/LazyEffect";
import { unsafeToArray } from "./unsafeToArray";

/**
 * This function is similar to {@link purry}, but it is used to make a
 * transducer function compatible with {@link pipe}'s lazy optimization.
 *
 * The `isDataFirst` parameter may be supplied to override the default heuristic
 * used to distinguish between data-first and data-last signatures.
 */
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
      case 0:
        isDataFirst = true;
        break;
      case 1:
        isDataFirst = false;
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

/**
 * This type is used to ensure that a data-last signature that returns a
 * {@link Transducer} matches the type of the implementation.
 */
export type DoTransduceResult<
  Data extends AnyIterable = AnyIterable,
  Result extends Array<unknown> = Array<unknown>,
> = Result | Transducer<Data, Result>;
