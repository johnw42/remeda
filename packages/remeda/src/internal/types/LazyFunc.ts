// Producers

export type LazyProducer<Data, Result> = (data: Data) => Iterable<Result>;

export type ProducerImpl<Data, Args extends ReadonlyArray<unknown>, Result> = (
  data: Data,
  ...args: Args
) => Iterable<Result>;

export type EagerProducer<Data, Result> = (data: Data) => Array<Result>;

export type Producer<Data, Result> = EagerProducer<Data, Result> & {
  readonly lazyKind: "producer";
  readonly lazy: LazyProducer<Data, Result>;
};

// Transducers

export type LazyTransducer<Data, Result> = (
  data: Iterable<Data>,
) => Iterable<Result>;

export type LazyTransducerImpl<
  Data,
  Args extends ReadonlyArray<unknown>,
  Result,
> = (data: Iterable<Data>, ...args: Args) => Iterable<Result>;

export type EagerTransducerImpl<
  Data,
  Args extends ReadonlyArray<unknown>,
  Result,
> = (data: Iterable<Data>, ...args: Args) => Array<Result>;

export type EagerTransducer<Data, Result> = (
  data: Iterable<Data>,
) => Array<Result>;

export type Transducer<Data, Result> = EagerTransducer<Data, Result> & {
  readonly lazyKind: "transducer";
  readonly lazy: LazyTransducer<Data, Result>;
};

// Reducers

export type EagerReducer<Data, Result> = (data: Iterable<Data>) => Result;

export type ReducerImpl<Data, Args extends ReadonlyArray<unknown>, Result> = (
  data: Iterable<Data>,
  ...args: Args
) => Result;

export type Reducer<Data, Result> = EagerReducer<Data, Result> & {
  readonly lazyKind: "reducer";
};

export type LazyOp =
  | Producer<unknown, unknown>
  | Transducer<unknown, unknown>
  | Reducer<unknown, unknown>;
