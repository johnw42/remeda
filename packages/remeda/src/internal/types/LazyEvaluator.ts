export type LazyProducer<R = unknown> = () => IteratorResult<
  ReadonlyArray<R>,
  ReadonlyArray<R>
>;

export type LazyTransducer<T = unknown, R = T> = (
  data: T,
) => IteratorResult<ReadonlyArray<R>, ReadonlyArray<R>>;

export type LazyReducer<T = unknown, R = T> = (
  data: T,
) => IteratorResult<void, R>;
