// Producers

export type LazyProducer<R = unknown> = () => IteratorResult<
  ReadonlyArray<R>,
  ReadonlyArray<R>
>;

export type EagerProducerImpl<
  Data,
  Args extends ReadonlyArray<unknown>,
  Result,
> = (data: Data, ...args: Args) => Iterable<Result>;

export type LazyProducerImpl<
  Data,
  Args extends ReadonlyArray<unknown>,
  Result,
> = (data: Data, ...args: Args) => LazyProducer<Result>;

export type DataLastProducerFunc<Data, Result> = (
  data: Data,
) => Iterable<Result>;

export type ProducerFunc<
  Data = unknown,
  Result = unknown,
> = DataLastProducerFunc<Data, Result> & {
  readonly lazyKind: "producer";
  readonly lazy: (data: Data) => LazyProducer<Result>;
};

// Transducers

export type LazyTransducer<T = unknown, R = T> = (
  data: T,
) => IteratorResult<ReadonlyArray<R>, ReadonlyArray<R>>;

export type EagerTransducerImpl<
  Data,
  Args extends ReadonlyArray<unknown>,
  Result,
> = (data: Iterable<Data>, ...args: Args) => Array<Result>;

export type LazyTransducerImpl<
  Data,
  Args extends ReadonlyArray<unknown>,
  Result,
> = (...args: Args) => LazyTransducer<Data, Result>;

export type DataLastTransducerFunc<Data, Result> = (
  data: ReadonlyArray<Data>,
) => Iterable<Result>;

export type TransducerFunc<
  Data = unknown,
  Result = unknown,
> = DataLastTransducerFunc<Data, Result> & {
  readonly lazyKind: "transducer";
  readonly lazy: LazyTransducer<Data, Result>;
};

// Reducers

export type LazyReducer<T = unknown, R = T> = (
  data: T,
) => IteratorResult<void, R>;

export type EagerReducerImpl<
  Data,
  Args extends ReadonlyArray<unknown>,
  Result,
> = (data: ReadonlyArray<Data>, ...args: Args) => Result;

export type LazyReducerImpl<
  Data,
  Args extends ReadonlyArray<unknown>,
  Result,
> = (...args: Args) => LazyReducer<Data, Result>;

export type DataLastReducerFunc<Data, Result> = (
  data: ReadonlyArray<Data>,
) => Result;

export type ReducerFunc<Data = unknown, Result = unknown> = DataLastReducerFunc<
  Data,
  Result
> & {
  readonly lazyKind: "reducer";
  readonly lazy: LazyReducer<Data, Result>;
};
