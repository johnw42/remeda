/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsdoc/check-param-names, jsdoc/require-param -- we don't document the op params, it'd be redundant */

import {
  type LazyProducer,
  type LazyTransducer,
  type Reducer,
  lazyKind,
  lazyImpl,
  type LazyEffect,
} from "./internal/types/LazyFunc";

type EagerEffect = ((input: unknown) => unknown) & {
  readonly [lazyKind]?: undefined;
};

class LazyPipeline {
  private readonly producer: LazyProducer<unknown, unknown> | undefined =
    undefined;
  private readonly transducers: Array<
    LazyTransducer<Iterable<unknown>, Array<unknown>>
  > = [];
  private readonly reducer: Reducer<unknown, unknown> | undefined = undefined;
  public readonly length: number;

  public constructor(
    operations: ReadonlyArray<LazyEffect | EagerEffect>,
    startIndex: number,
  ) {
    let i: number;
    for (i = startIndex; i < operations.length; i++) {
      const lazyOp = operations[i]!;
      let breakLoop = false;
      switch (lazyOp[lazyKind]) {
        case undefined:
          breakLoop = true;
          break;
        case "producer":
          if (this.producer === undefined) {
            this.producer = lazyOp[lazyImpl];
          } else {
            breakLoop = true;
          }
          break;
        case "transducer":
          this.transducers.push(lazyOp[lazyImpl]);
          break;
        case "reducer":
          this.reducer = lazyOp;
          breakLoop = true;
          break;
      }
      if (breakLoop) {
        break;
      }
    }
    this.length =
      Number(this.producer !== undefined) +
      this.transducers.length +
      Number(this.reducer !== undefined);
  }

  public run(input: unknown): unknown {
    const runTransducers = (
      start: number,
      valuesIn: Iterable<unknown>,
    ): Iterable<unknown> => {
      if (start >= this.transducers.length) {
        return valuesIn;
      }

      return runTransducers(start + 1, this.transducers[start]!(valuesIn));
    };

    const results = runTransducers(
      0,
      this.producer === undefined
        ? (input as Iterable<unknown>)
        : this.producer(input),
    );
    return this.reducer === undefined ? [...results] : this.reducer(results);
  }
}

/**
 * A function from `A` to `B`, where an input type of `Iterable<T>` is narrowed
 * to `ReadonlyArray<T>`.  This narrowing allows functions that only accept
 * arrays when otherwise they would have to accept any iterable.
 */
type Effect<A, B> = (input: A) => B;
// type Effect<A, B> = {
//   (input: A): B;
//   //(input: A extends Iterable<infer T> ? IterableContainer<T> : A): B;
// };
// type Effect<A, B> = (
//   input: A extends Iterable<infer T> ? A & IterableContainer<T> : A,
// ) => B; //&(A extends Iterable<unknown> ? { [lazyKind]: unknown } : unknown);

/**
 * Perform left-to-right function composition.
 *
 * @param value - The initial value.
 * @param operations - The list of operations to apply.
 * @signature R.pipe(data, op1, op2, op3)
 * @example
 *    R.pipe(
 *      [1, 2, 3, 4],
 *      R.map(x => x * 2),
 *      arr => [arr[0] + arr[1], arr[2] + arr[3]],
 *    ) // => [6, 14]
 * @dataFirst
 * @category Function
 */
export function pipe<A, B>(value: A, op1: Effect<A, B>): B;

export function pipe<A, B, C>(
  value: A,
  op1: Effect<A, B>,
  op2: Effect<B, C>,
): C;

export function pipe<A, B, C, D>(
  value: A,
  op1: Effect<A, B>,
  op2: Effect<B, C>,
  op3: Effect<C, D>,
): D;

export function pipe<A, B, C, D, E>(
  value: A,
  op1: Effect<A, B>,
  op2: Effect<B, C>,
  op3: Effect<C, D>,
  op4: Effect<D, E>,
): E;

export function pipe<A, B, C, D, E, F>(
  value: A,
  op1: Effect<A, B>,
  op2: Effect<B, C>,
  op3: Effect<C, D>,
  op4: Effect<D, E>,
  op5: Effect<E, F>,
): F;

export function pipe<A, B, C, D, E, F, G>(
  value: A,
  op1: Effect<A, B>,
  op2: Effect<B, C>,
  op3: Effect<C, D>,
  op4: Effect<D, E>,
  op5: Effect<E, F>,
  op6: Effect<F, G>,
): G;

export function pipe<A, B, C, D, E, F, G, H>(
  value: A,
  op1: Effect<A, B>,
  op2: Effect<B, C>,
  op3: Effect<C, D>,
  op4: Effect<D, E>,
  op5: Effect<E, F>,
  op6: Effect<F, G>,
  op7: Effect<G, H>,
): H;

export function pipe<A, B, C, D, E, F, G, H, I>(
  value: A,
  op1: Effect<A, B>,
  op2: Effect<B, C>,
  op3: Effect<C, D>,
  op4: Effect<D, E>,
  op5: Effect<E, F>,
  op6: Effect<F, G>,
  op7: Effect<G, H>,
  op8: Effect<H, I>,
): I;

export function pipe<A, B, C, D, E, F, G, H, I, J>(
  value: A,
  op1: Effect<A, B>,
  op2: Effect<B, C>,
  op3: Effect<C, D>,
  op4: Effect<D, E>,
  op5: Effect<E, F>,
  op6: Effect<F, G>,
  op7: Effect<G, H>,
  op8: Effect<H, I>,
  op9: Effect<I, J>,
): J;

export function pipe<A, B, C, D, E, F, G, H, I, J, K>(
  value: A,
  op01: Effect<A, B>,
  op02: Effect<B, C>,
  op03: Effect<C, D>,
  op04: Effect<D, E>,
  op05: Effect<E, F>,
  op06: Effect<F, G>,
  op07: Effect<G, H>,
  op08: Effect<H, I>,
  op09: Effect<I, J>,
  op10: Effect<J, K>,
): K;

export function pipe<A, B, C, D, E, F, G, H, I, J, K, L>(
  value: A,
  op01: Effect<A, B>,
  op02: Effect<B, C>,
  op03: Effect<C, D>,
  op04: Effect<D, E>,
  op05: Effect<E, F>,
  op06: Effect<F, G>,
  op07: Effect<G, H>,
  op08: Effect<H, I>,
  op09: Effect<I, J>,
  op10: Effect<J, K>,
  op11: Effect<K, L>,
): L;

export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M>(
  value: A,
  op01: Effect<A, B>,
  op02: Effect<B, C>,
  op03: Effect<C, D>,
  op04: Effect<D, E>,
  op05: Effect<E, F>,
  op06: Effect<F, G>,
  op07: Effect<G, H>,
  op08: Effect<H, I>,
  op09: Effect<I, J>,
  op10: Effect<J, K>,
  op11: Effect<K, L>,
  op12: Effect<L, M>,
): M;

export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
  value: A,
  op01: Effect<A, B>,
  op02: Effect<B, C>,
  op03: Effect<C, D>,
  op04: Effect<D, E>,
  op05: Effect<E, F>,
  op06: Effect<F, G>,
  op07: Effect<G, H>,
  op08: Effect<H, I>,
  op09: Effect<I, J>,
  op10: Effect<J, K>,
  op11: Effect<K, L>,
  op12: Effect<L, M>,
  op13: Effect<M, N>,
): N;

export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
  value: A,
  op01: Effect<A, B>,
  op02: Effect<B, C>,
  op03: Effect<C, D>,
  op04: Effect<D, E>,
  op05: Effect<E, F>,
  op06: Effect<F, G>,
  op07: Effect<G, H>,
  op08: Effect<H, I>,
  op09: Effect<I, J>,
  op10: Effect<J, K>,
  op11: Effect<K, L>,
  op12: Effect<L, M>,
  op13: Effect<M, N>,
  op14: Effect<N, O>,
): O;

export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(
  value: A,
  op01: Effect<A, B>,
  op02: Effect<B, C>,
  op03: Effect<C, D>,
  op04: Effect<D, E>,
  op05: Effect<E, F>,
  op06: Effect<F, G>,
  op07: Effect<G, H>,
  op08: Effect<H, I>,
  op09: Effect<I, J>,
  op10: Effect<J, K>,
  op11: Effect<K, L>,
  op12: Effect<L, M>,
  op13: Effect<M, N>,
  op14: Effect<N, O>,
  op15: Effect<O, P>,
): P;

export function pipe(
  input: unknown,
  ...operations: ReadonlyArray<LazyEffect | EagerEffect>
): any {
  let output = input;

  let opIndex = 0;
  while (opIndex < operations.length) {
    const op = operations[opIndex]!;
    if (
      op[lazyKind] === undefined ||
      (op[lazyKind] !== "producer" && !isIterable(output))
    ) {
      output = (op as EagerEffect)(output);
      opIndex += 1;
      continue;
    }

    const lazyPipeline = new LazyPipeline(operations, opIndex);
    output = lazyPipeline.run(output);
    opIndex += lazyPipeline.length;
  }
  return output;
}

function isIterable(something: unknown): something is Iterable<unknown> {
  // Check for null and undefined to avoid errors when accessing Symbol.iterator
  return (
    typeof something === "string" ||
    (typeof something === "object" &&
      something !== null &&
      Symbol.iterator in something)
  );
}
