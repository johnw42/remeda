/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsdoc/check-param-names, jsdoc/require-param -- we don't document the op params, it'd be redundant */

import type {
  LazyProducer,
  LazyReducer,
  LazyTransducer,
} from "./internal/types/LazyEvaluator";
import type LazyFunc from "./internal/types/LazyFunc";
import { EMPTY_RESULT } from "./internal/utilityEvaluators";

type EagerFunc = ((input: unknown) => unknown) & {
  readonly lazyKind?: undefined;
};

class LazyPipeline<T> {
  public readonly producer: ((data: T) => LazyProducer<T>) | undefined =
    undefined;
  public readonly transducers: Array<LazyTransducer<T>> = [];
  public readonly reducer: LazyReducer<T> | undefined = undefined;
  public readonly length: number;

  public constructor(
    operations: ReadonlyArray<LazyFunc | EagerFunc>,
    startIndex: number,
  ) {
    let i: number;
    for (i = startIndex; i < operations.length; i++) {
      const lazyOp = operations[i]!;
      let breakLoop = false;
      switch (lazyOp.lazyKind) {
        case undefined:
          breakLoop = true;
          break;
        case "producer":
          if (this.producer === undefined) {
            this.producer = lazyOp.lazy as (data: T) => LazyProducer<T>;
          } else {
            breakLoop = true;
          }
          break;
        case "transducer":
          this.transducers.push(lazyOp.lazy as LazyTransducer<T>);
          break;
        case "reducer":
          this.reducer = lazyOp.lazy as LazyReducer<T>;
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
    const producer: LazyProducer<T> =
      this.producer === undefined
        ? iterableToProducer(input as Array<T>)
        : this.producer(input as T);

    const accum: Array<unknown> = [];

    const runTransducers = (start: number, valueIn: T): boolean => {
      if (start >= this.transducers.length) {
        if (this.reducer === undefined) {
          accum.push(valueIn);
          return false;
        }
        const rResult = this.reducer(valueIn);
        if (rResult.done === true) {
          accum.push(rResult.value);
          return true;
        }
        return false;
      }

      const tResult = this.transducers[start]!(valueIn);
      if (tResult.done === true) {
        accum.push(...tResult.value);
        return true;
      }
      for (const value of tResult.value) {
        if (runTransducers(start + 1, value)) {
          return true;
        }
      }
      return false;
    };

    for (;;) {
      let breakLoop = false;
      const pResult = producer();
      for (const value of pResult.value) {
        if (runTransducers(0, value)) {
          breakLoop = true;
          break;
        }
      }
      if (breakLoop || pResult.done === true) {
        break;
      }
    }

    return this.reducer === undefined ? accum : accum[0];
  }
}

function iterableToProducer<T>(input: Iterable<T>): LazyProducer<T> {
  const iter = input[Symbol.iterator]();
  return () => {
    const next = iter.next();
    if (next.done === true) {
      return EMPTY_RESULT;
    }
    return { value: [next.value] };
  };
}

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
export function pipe<A, B>(value: A, op1: (input: A) => B): B;
export function pipe<A, B, C>(
  value: A,
  op1: (input: A) => B,
  op2: (input: B) => C,
): C;

export function pipe<A, B, C, D>(
  value: A,
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
): D;

export function pipe<A, B, C, D, E>(
  value: A,
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
): E;

export function pipe<A, B, C, D, E, F>(
  value: A,
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
  op5: (input: E) => F,
): F;

export function pipe<A, B, C, D, E, F, G>(
  value: A,
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
  op5: (input: E) => F,
  op6: (input: F) => G,
): G;

export function pipe<A, B, C, D, E, F, G, H>(
  value: A,
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
  op5: (input: E) => F,
  op6: (input: F) => G,
  op7: (input: G) => H,
): H;

export function pipe<A, B, C, D, E, F, G, H, I>(
  value: A,
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
  op5: (input: E) => F,
  op6: (input: F) => G,
  op7: (input: G) => H,
  op8: (input: H) => I,
): I;

export function pipe<A, B, C, D, E, F, G, H, I, J>(
  value: A,
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
  op5: (input: E) => F,
  op6: (input: F) => G,
  op7: (input: G) => H,
  op8: (input: H) => I,
  op9: (input: I) => J,
): J;

export function pipe<A, B, C, D, E, F, G, H, I, J, K>(
  value: A,
  op01: (input: A) => B,
  op02: (input: B) => C,
  op03: (input: C) => D,
  op04: (input: D) => E,
  op05: (input: E) => F,
  op06: (input: F) => G,
  op07: (input: G) => H,
  op08: (input: H) => I,
  op09: (input: I) => J,
  op10: (input: J) => K,
): K;

export function pipe<A, B, C, D, E, F, G, H, I, J, K, L>(
  value: A,
  op01: (input: A) => B,
  op02: (input: B) => C,
  op03: (input: C) => D,
  op04: (input: D) => E,
  op05: (input: E) => F,
  op06: (input: F) => G,
  op07: (input: G) => H,
  op08: (input: H) => I,
  op09: (input: I) => J,
  op10: (input: J) => K,
  op11: (input: K) => L,
): L;

export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M>(
  value: A,
  op01: (input: A) => B,
  op02: (input: B) => C,
  op03: (input: C) => D,
  op04: (input: D) => E,
  op05: (input: E) => F,
  op06: (input: F) => G,
  op07: (input: G) => H,
  op08: (input: H) => I,
  op09: (input: I) => J,
  op10: (input: J) => K,
  op11: (input: K) => L,
  op12: (input: L) => M,
): M;

export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
  value: A,
  op01: (input: A) => B,
  op02: (input: B) => C,
  op03: (input: C) => D,
  op04: (input: D) => E,
  op05: (input: E) => F,
  op06: (input: F) => G,
  op07: (input: G) => H,
  op08: (input: H) => I,
  op09: (input: I) => J,
  op10: (input: J) => K,
  op11: (input: K) => L,
  op12: (input: L) => M,
  op13: (input: M) => N,
): N;

export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
  value: A,
  op01: (input: A) => B,
  op02: (input: B) => C,
  op03: (input: C) => D,
  op04: (input: D) => E,
  op05: (input: E) => F,
  op06: (input: F) => G,
  op07: (input: G) => H,
  op08: (input: H) => I,
  op09: (input: I) => J,
  op10: (input: J) => K,
  op11: (input: K) => L,
  op12: (input: L) => M,
  op13: (input: M) => N,
  op14: (input: N) => O,
): O;

export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(
  value: A,
  op01: (input: A) => B,
  op02: (input: B) => C,
  op03: (input: C) => D,
  op04: (input: D) => E,
  op05: (input: E) => F,
  op06: (input: F) => G,
  op07: (input: G) => H,
  op08: (input: H) => I,
  op09: (input: I) => J,
  op10: (input: J) => K,
  op11: (input: K) => L,
  op12: (input: L) => M,
  op13: (input: M) => N,
  op14: (input: N) => O,
  op15: (input: O) => P,
): P;

export function pipe(
  input: unknown,
  ...operations: ReadonlyArray<LazyFunc | EagerFunc>
): any {
  let output = input;

  let opIndex = 0;
  while (opIndex < operations.length) {
    const op = operations[opIndex]!;
    if (
      op.lazyKind === undefined ||
      (op.lazyKind !== "producer" && !isIterable(output))
    ) {
      output = (op as EagerFunc)(output);
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
