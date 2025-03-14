/* eslint-disable @typescript-eslint/unbound-method */
import { identity } from "../identity";
import { toBasicIterable } from "./toBasicIterable";
import { AsymmetricMatcher, equals } from "@vitest/expect";
import { isObjectWithProps } from "./isObjectWithProps";

class SameRefMatcher extends AsymmetricMatcher<unknown> {
  public override asymmetricMatch(other: unknown): boolean {
    return this.sample === other;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  public override toString(): string {
    return "SameRefMatcher";
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  public override toAsymmetricMatcher(): string {
    return "SameRefMatcher.toAsymmetricMatcher";
  }

  public static for(sample: unknown): SameRefMatcher {
    return new SameRefMatcher(sample);
  }
}

class ArrayContentMatcher<T> extends AsymmetricMatcher<ReadonlyArray<T>> {
  public constructor(sample: Iterable<T>) {
    super([...sample]);
  }

  public override asymmetricMatch(other: unknown): boolean {
    if (!isObjectWithProps(other, Symbol.iterator)) {
      return false;
    }

    const otherArray = [...(other as Iterable<T>)];

    return (
      this.sample.length === otherArray.length &&
      this.sample.every((v, i) => equals(v, otherArray[i]))
    );
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  public override toString(): string {
    return "ArrayContentMatcher";
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  public override toAsymmetricMatcher(): string {
    return "ArrayContentMatcher.toAsymmetricMatcher";
  }

  public static for<T>(sample: Iterable<T>): ArrayContentMatcher<T> {
    return new ArrayContentMatcher(sample);
  }
}

/**
 * A function that either returns its argument unchanged or wraps it using {@link toBasicIterable}.
 */
type WrapperFn = typeof toBasicIterable;

/**
 * The body passed to `describeIterableArg`.
 */
type BodyFn = (info: IterableArgInfo) => void | PromiseLike<void>;

type IterableArgInfo = {
  /**
   * @see WrapperFn
   */
  readonly wrap: WrapperFn;
  /**
   * A string describing the type of data being returned by `wrap`.
   */
  readonly what: string;
  /**
   * True iff `wrap` returns the original array.
   */
  readonly dataIsArray: boolean;
  /**
   * An asymmetric matcher that either checks if two arrays are the same reference or they have the same content.
   */
  readonly wrappedArray: <T>(a: Iterable<T>) => boolean;
};

/**
 * A wrapper around `describe` that allows for testing functions with both
 * arrays and generic iterables.
 */
export function describeIterableArg(desc: string, body: BodyFn): void;
export function describeIterableArg(body: BodyFn): void;

export function describeIterableArg(...args: ReadonlyArray<unknown>): void {
  let desc: string;
  let body: BodyFn;
  if (args.length === 2) {
    [desc, body] = args as [string, BodyFn];
    if (/\$what\b/u.exec(desc) === null) {
      desc += " where type of data is $what";
    }
  } else {
    [body] = args as [BodyFn];
    desc = "where type of data is $what";
  }

  describe.each`
    what           | dataIsArray | wrappedArray               | wrap
    ${"array"}     | ${true}     | ${SameRefMatcher.for}      | ${identity()}
    ${"generator"} | ${false}    | ${ArrayContentMatcher.for} | ${toBasicIterable}
  `(desc, (info: IterableArgInfo) => body(info));
}
