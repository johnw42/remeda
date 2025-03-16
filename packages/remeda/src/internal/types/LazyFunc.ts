import type { IterableElement } from "type-fest";

// This file defines types related to three different kinds of lazy functions:
// - Producers: functions that take a single value and return an iterable.
// - Transducers: functions that take an iterable and return another iterable.
// - Reducers: functions that take an iterable and return a single value.
//
// Each category contains a set of related types:
// - Lazy*: A function that processes it arguments and/or produces its results lazily.
// - Lazy*Impl: A function contining the lazy implementation of a function.
// - Eager*Impl: A function contining the eager implementation of a function.
// - *: A function that operaters eagerly and contains additional fields to support a lazy implementation.
// - *F: A variant to * that accepts a function as a type parameter.

export const lazyKind = Symbol("lazyKind");
export const lazyImpl = Symbol("lazyImpl");

export type LazyEffect =
  | Producer<unknown, Array<unknown>>
  | Transducer<Iterable<unknown>, Array<unknown>>
  | Reducer<Iterable<unknown>, unknown>;

// Producers

export type LazyProducer<Data, Result extends Iterable<unknown>> = (
  data: Data,
) => Iterable<IterableElement<Result>>;

export type LazyProducerImpl<
  Data,
  Args extends ReadonlyArray<unknown>,
  Result extends Iterable<unknown>,
> = (data: Data, ...args: Args) => Iterable<IterableElement<Result>>;

export type EagerProducer<Data, Result extends Array<unknown>> = (
  data: Data,
) => Result;

export type Producer<Data, Result extends Array<unknown>> = ProducerF<
  EagerProducer<Data, Result>
>;

export type ProducerF<F extends EagerProducer<never, Array<unknown>>> = {
  // This type could be `F & {...}`, but using `&` causes type inference to fail.
  // See https://github.com/microsoft/TypeScript/issues/61417
  (...args: Parameters<F>): ReturnType<F>;
  readonly [lazyKind]: "producer";
  readonly [lazyImpl]: LazyProducer<Parameters<F>[0], ReturnType<F>>;
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

export type TransducerF<F extends EagerTransducer<never, Array<unknown>>> = {
  // This type could be `F & {...}`, but using `&` causes type inference to fail.
  // See https://github.com/microsoft/TypeScript/issues/61417
  (...args: Parameters<F>): ReturnType<F>;
  readonly [lazyKind]: "transducer";
  readonly [lazyImpl]: LazyTransducer<Parameters<F>[0], ReturnType<F>>;
};

// Reducers

export type EagerReducer<Data extends Iterable<unknown>, Result> = (
  data: Data,
) => Result;

export type ReducerImpl<
  Data extends Iterable<unknown>,
  Args extends ReadonlyArray<unknown>,
  Result,
> = (data: Data, ...args: Args) => Result;

export type Reducer<Data extends Iterable<unknown>, Result> = ReducerF<
  EagerReducer<Data, Result>
>;

export type ReducerF<F extends EagerReducer<IterableElement<never>, unknown>> =
  {
    // This type could be `F & {...}`, but using `&` causes type inference to fail.
    // See https://github.com/microsoft/TypeScript/issues/61417
    (...args: Parameters<F>): ReturnType<F>;
    readonly [lazyKind]: "reducer";
  };
