import type { ReadonlyDeep } from "type-fest";
import type {
  LazyProducer,
  LazyReducer,
  LazyTransducer,
} from "./LazyEvaluator";

export type EagerProducerImpl<
  Data,
  Args extends ReadonlyArray<unknown>,
  Result,
> = (data: Data, ...args: Args) => Array<Result>;

export type EagerTransducerImpl<
  Data,
  Args extends ReadonlyArray<unknown>,
  Result,
> = (data: ReadonlyArray<Data>, ...args: Args) => Array<Result>;

export type EagerReducerImpl<
  Data,
  Args extends ReadonlyArray<unknown>,
  Result,
> = (data: ReadonlyArray<Data>, ...args: Args) => Result;

export type LazyProducerImpl<
  Data,
  Args extends ReadonlyArray<unknown>,
  Result,
> = (...args: Args) => LazyProducer<Data, Result>;

export type LazyTransducerImpl<
  Data,
  Args extends ReadonlyArray<unknown>,
  Result,
> = (...args: Args) => LazyTransducer<Data, Result>;

export type LazyReducerImpl<
  Data,
  Args extends ReadonlyArray<unknown>,
  Result,
> = (...args: Args) => LazyReducer<Data, Result>;

export type DataLastProducerFunc<Data, Result> = (
  data: Data,
) => Iterable<Result>;

export type DataLastTransducerFunc<Data, Result> = (
  data: ReadonlyArray<Data>,
) => Iterable<Result>;

export type DataLastReducerFunc<Data, Result> = (
  data: ReadonlyArray<Data>,
) => Result;

export type ProducerFunc<
  Data = unknown,
  Result = unknown,
> = DataLastProducerFunc<Data, Result> & {
  readonly lazyKind: "producer";
  readonly lazy: LazyProducer<Data, Result>;
};

export type TransducerFunc<
  Data = unknown,
  Result = unknown,
> = DataLastTransducerFunc<Data, Result> & {
  readonly lazyKind: "transducer";
  readonly lazy: LazyTransducer<Data, Result>;
};

export type ReducerFunc<Data = unknown, Result = unknown> = DataLastReducerFunc<
  Data,
  Result
> & {
  readonly lazyKind: "reducer";
  readonly lazy: LazyReducer<Data, Result>;
};

export type LazyFunc<Data = unknown, Result = unknown> = ReadonlyDeep<
  | ProducerFunc<Data, Result>
  | TransducerFunc<Data, Result>
  | ReducerFunc<Data, Result>
>;

export default LazyFunc;
