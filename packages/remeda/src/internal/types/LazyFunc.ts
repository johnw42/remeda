import type { IterableElement } from "type-fest";

export const lazyKind = Symbol("lazyKind");
export const lazyImpl = Symbol("lazyImpl");
export const isLazy = Symbol("isLazy");

export type LazyEffect =
  | Producer<unknown, unknown>
  | Transducer<Iterable<unknown>, Array<unknown>>
  | Reducer<unknown, unknown>;

// Producers

export type LazyProducer<Data, Result> = (data: Data) => Iterable<Result>;

export type ProducerImpl<Data, Args extends ReadonlyArray<unknown>, Result> = (
  data: Data,
  ...args: Args
) => Iterable<Result>;

export type EagerProducer<Data, Result> = (data: Data) => Array<Result>;

export type Producer<Data, Result> = EagerProducer<Data, Result> & {
  readonly [lazyKind]: "producer";
  readonly [lazyImpl]: LazyProducer<Data, Result>;
};

// Transducers

export type LazyTransducer<
  Data extends Iterable<unknown>,
  Result extends Iterable<unknown>,
> = (data: Data) => Iterable<IterableElement<Result>>;

export type LazyTransducerImpl<
  Data extends Iterable<unknown>,
  Args extends ReadonlyArray<unknown>,
  Result extends Iterable<unknown>,
> = (data: Data, ...args: Args) => Iterable<IterableElement<Result>>;

export type EagerTransducerImpl<
  Data extends Iterable<unknown>,
  Args extends ReadonlyArray<unknown>,
  Result extends Array<unknown>,
> = (data: Data, ...args: Args) => Result;

export type EagerTransducer<
  Data extends Iterable<unknown>,
  Result extends Array<unknown>,
> = (data: Data) => Result;

export type Transducer<
  Data extends Iterable<unknown>,
  Result extends Array<unknown>,
> = TransducerF<EagerTransducer<Data, Result>>;

export type TransducerF<
  F extends EagerTransducer<IterableElement<never>, Array<unknown>>,
> = {
  // This type could be `F & {...}`, but using `&` causes type inference to fail.
  // See https://github.com/microsoft/TypeScript/issues/61417
  (...args: Parameters<F>): ReturnType<F>;
  readonly [lazyKind]: "transducer";
  readonly [lazyImpl]: LazyTransducer<Parameters<F>[0], ReturnType<F>>;
};

// Reducers

export type EagerReducer<Data, Result> = (data: Iterable<Data>) => Result;

export type ReducerImpl<Data, Args extends ReadonlyArray<unknown>, Result> = (
  data: Iterable<Data>,
  ...args: Args
) => Result;

export type Reducer<Data, Result> = EagerReducer<Data, Result> & {
  readonly [lazyKind]: "reducer";
};
