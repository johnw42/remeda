// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export function iteratorToIterable<T>(data: Iterator<T>): Iterable<T> {
  return {
    [Symbol.iterator]: () => data,
  };
}
