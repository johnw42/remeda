import type { IsInteger } from "type-fest";
import { toReadonlyArray } from "./internal/toReadonlyArray";
import type AnyIterable from "./internal/types/AnyIterable";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type ToArray from "./internal/types/ToArray";
import { purry } from "./purry";

type Sampled<
  T extends AnyIterable,
  N extends number,
> = T extends IterableContainer
  ? IsInteger<N> extends true
    ? // We check if the input tuple is shorter than N. We need to check this
      // outside the recursive loop because T changes inside that loop
      undefined extends T[N]
      ? T
      : SampledLiteral<T, N>
    : SampledGeneric<T>
  : ToArray<T>;

type SampledGeneric<T extends IterableContainer> =
  // Stop the recursion when the array is empty
  T[number] extends never
    ? T
    : // As long as the tuple has non-rest elements we continue expanding the type
      // by both taking the item, and not taking it.
      T extends readonly [infer First, ...infer Rest]
      ? SampledGeneric<Rest> | [First, ...SampledGeneric<Rest>]
      : // Stop the recursion also when we have an array, or the rest element of the
        // tuple
        Array<T[number]>;

type SampledLiteral<
  T extends IterableContainer,
  N extends number,
  Iteration extends Array<unknown> = [],
> =
  // Stop the recursion when the Iteration "array" is full
  Iteration["length"] extends N
    ? []
    : // If the tuple has a defined (non-rest) element, cut it and add it to the
      // output tuple.
      T extends readonly [infer First, ...infer Tail]
      ? [
          First | Tail[number],
          ...SampledLiteral<Tail, N, [unknown, ...Iteration]>,
        ]
      : T extends readonly [...infer Head, infer Last]
        ? [...SampledLiteral<Head, N, [unknown, ...Iteration]>, Last]
        : // If the input is an array, or a tuple's rest-element we need to split the
          // recursion in 2, one type adds an element to the output, and the other
          // skips it, just like the sample method itself.
          | SampledLiteral<T, N, [unknown, ...Iteration]>
            | [T[number], ...SampledLiteral<T, N, [unknown, ...Iteration]>];

/**
 * Returns a random subset of size `sampleSize` from `array`.
 *
 * Maintains and infers most of the typing information that could be passed
 * along to the output. This means that when using tuples, the output will be
 * a tuple too, and when using literals, those literals would be preserved.
 *
 * The items in the result are kept in the same order as they are in the input.
 * If you need to get a shuffled response you can pipe the shuffle function
 * after this one.
 *
 * @param data - The array.
 * @param sampleSize - The number of elements to take.
 * @signature
 *    R.sample(array, sampleSize)
 * @example
 *    R.sample(["hello", "world"], 1); // => ["hello"] // typed string[]
 *    R.sample(["hello", "world"] as const, 1); // => ["world"] // typed ["hello" | "world"]
 * @dataFirst
 * @category Array
 */
export function sample<T extends AnyIterable, N extends number = number>(
  data: T,
  sampleSize: N,
): Sampled<T, N>;

/**
 * Returns a random subset of size `sampleSize` from `array`.
 *
 * Maintains and infers most of the typing information that could be passed
 * along to the output. This means that when using tuples, the output will be
 * a tuple too, and when using literals, those literals would be preserved.
 *
 * The items in the result are kept in the same order as they are in the input.
 * If you need to get a shuffled response you can pipe the shuffle function
 * after this one.
 *
 * @param sampleSize - The number of elements to take.
 * @signature
 *    R.sample(sampleSize)(array)
 * @example
 *    R.sample(1)(["hello", "world"]); // => ["hello"] // typed string[]
 *    R.sample(1)(["hello", "world"] as const); // => ["world"] // typed ["hello" | "world"]
 * @dataLast
 * @category Array
 */
export function sample<T extends AnyIterable, N extends number = number>(
  sampleSize: N,
): (data: T) => Sampled<T, N>;

export function sample(...args: ReadonlyArray<unknown>): unknown {
  return purry(sampleImplementation, args);
}

function sampleImplementation<T>(
  data: Iterable<T>,
  sampleSize: number,
): Array<T> {
  if (sampleSize <= 0) {
    // Trivial
    return [];
  }

  const array = toReadonlyArray(data);

  if (sampleSize >= array.length) {
    // Trivial
    return array === data
      ? [...array]
      : // This cast is safe because it only happens when toReadonlyArray has
        // created a new array.
        (array as Array<T>);
  }

  // We have 2 modes of sampling, depending on the size of the sample requested.
  // 1. If sampleSize is _small_, we generate indices that we then use to
  // *EXTRACT* individual elements from the array.
  // 2. If sampleSize is _large_, we instead generate indices to *EXCLUDE* from
  // a full scan of the input array (via filtering).
  //
  // This allows us 2 optimizations that are the core of how this function
  // works:
  // 1. It is hard to generate a large number of unique indices, as the more
  // indices we generate the more likely we are to generate one that is already
  // in the set, which would require more iterations of the generation loop.
  // Capping our effective sampleSize at n/2 would put an upper limit to the
  // average number of iterations required (as a function of n).
  // 2. If sample size is small enough, we never need to actually iterate over
  // the full input array at all; instead we simply project the values we need
  // via random access into the array. This means that for sampleSize (K) less
  // than n/2, we run at O(klogk). For large sampleSize we need to iterate over
  // the full input array, but we don't need to sort the indices because we can
  // use the Set's 'has' method, so we effectively run at O(n).
  const actualSampleSize = Math.min(sampleSize, array.length - sampleSize);

  const sampleIndices = new Set<number>();
  while (sampleIndices.size < actualSampleSize) {
    const randomIndex = Math.floor(Math.random() * array.length);
    sampleIndices.add(randomIndex);
  }

  if (sampleSize === actualSampleSize) {
    return [...sampleIndices]
      .sort((a, b) => a - b)
      .map((index) => array[index]!);
  }

  return array.filter((_, index) => !sampleIndices.has(index));
}
