import type { IterableElement } from "type-fest";
import type ToIterable from "./ToIterable";
import type AnyIterable from "./AnyIterable";

// This file defines types related to three different kinds "effect" functions:
// - Producers: functions that take a single value and return an iterable.
// - Transducers: functions that take an iterable and return another iterable.
// - Reducers: functions that take an iterable and return a single value.
//
// Each category contains a set of related types:
// - Lazy*: An effect that processes it arguments and/or produces its results lazily.
// - Lazy*Impl: A function contining the lazy implementation of an effect.
// - Eager*Impl: A function contining the eager implementation of an effect.
// - *: An eager effect that contains additional fields to support a lazy implementation.

export const lazyKind = Symbol("lazyKind");
export const lazyImpl = Symbol("lazyImpl");

export type LazyEffect =
  | Producer<unknown, Array<unknown>>
  | Transducer<Iterable<unknown>, Array<unknown>>
  | Reducer<Iterable<unknown>, unknown>;

// Producers

export type LazyProducer<Data, Result extends AnyIterable> = (
  data: Data,
) => ToIterable<Result>;

export type LazyProducerImpl<
  Data,
  Args extends ReadonlyArray<unknown>,
  Result extends AnyIterable,
> = (data: Data, ...args: Args) => ToIterable<Result>;

export type EagerProducer<Data, Result extends Array<unknown>> = (
  data: Data,
) => Result;

export type Producer<Data, Result extends Array<unknown>> = ProducerF<
  EagerProducer<Data, Result>
>;

type ProducerF<F extends EagerProducer<never, Array<unknown>>> = {
  // This type could be `F & {...}`, but using `&` causes type inference to fail.
  // See https://github.com/microsoft/TypeScript/issues/61417
  (...args: Parameters<F>): ReturnType<F>;
  readonly [lazyKind]: "producer";
  readonly [lazyImpl]: LazyProducer<Parameters<F>[0], ReturnType<F>>;
};

// Transducers

export type LazyTransducer<
  Data extends AnyIterable,
  Result extends AnyIterable,
> = (data: Data) => ToIterable<Result>;

export type LazyTransducerImpl<
  Data extends AnyIterable,
  Args extends ReadonlyArray<unknown>,
  Result extends AnyIterable,
> = (data: Data, ...args: Args) => ToIterable<Result>;

export type EagerTransducerImpl<
  Data extends AnyIterable,
  Args extends ReadonlyArray<unknown>,
  Result extends Array<unknown>,
> = (data: Data, ...args: Args) => Result;

export type EagerTransducer<
  Data extends AnyIterable,
  Result extends Array<unknown>,
> = (data: Data) => Result;

export type Transducer<
  Data extends AnyIterable,
  Result extends Array<unknown>,
> = TransducerF<EagerTransducer<Data, Result>>;

// This type only works for monomorphic functions. For polymorphic functions, we
// need to inline the definition where it is used.  See `drop` for an example.
type TransducerF<F extends EagerTransducer<never, Array<unknown>>> = {
  // This type could be `F & {...}`, but using `&` causes type inference to fail.
  // See https://github.com/microsoft/TypeScript/issues/61417
  (...args: Parameters<F>): ReturnType<F>;
  readonly [lazyKind]: "transducer";
  readonly [lazyImpl]: LazyTransducer<Parameters<F>[0], ReturnType<F>>;
};

// Reducers

export type EagerReducer<Data extends AnyIterable, Result> = (
  data: Data,
) => Result;

export type ReducerImpl<
  Data extends AnyIterable,
  Args extends ReadonlyArray<unknown>,
  Result,
> = (data: Data, ...args: Args) => Result;

export type Reducer<Data extends AnyIterable, Result> = ReducerF<
  EagerReducer<Data, Result>
>;

// This type only works for monomorphic functions. For polymorphic functions, we
// need to inline the definition where it is used.  See `first` for an example.
type ReducerF<F extends EagerReducer<IterableElement<never>, unknown>> = {
  // This type could be `F & {...}`, but using `&` causes type inference to fail.
  // See https://github.com/microsoft/TypeScript/issues/61417
  (...args: Parameters<F>): ReturnType<F>;
  readonly [lazyKind]: "reducer";
};
