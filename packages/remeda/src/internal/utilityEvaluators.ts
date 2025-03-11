export function simplifyCallback<T, U>(
  callbackfn: (value: T, index: number, data: ReadonlyArray<T>) => U,
): (value: T) => U {
  switch (callbackfn.length) {
    case 1:
      return callbackfn as (value: T) => U;
    case 2: {
      let index = 0;
      return (value) =>
        (callbackfn as (value: T, index: number) => U)(value, index++);
    }
    default: {
      const data: Array<T> = [];
      return (value) => {
        data.push(value);
        return callbackfn(value, data.length - 1, data);
      };
    }
  }
}

export function simplifyCallback2<E, T, U>(
  callbackfn: (extra: E, value: T, index: number, data: ReadonlyArray<T>) => U,
): (extra: E, value: T) => U {
  switch (callbackfn.length) {
    case 2:
      return callbackfn as (extra: E, value: T) => U;
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    case 3: {
      let index = 0;
      return (extra, value) =>
        (callbackfn as (extra: E, value: T, index: number) => U)(
          extra,
          value,
          index++,
        );
    }
    default: {
      const data: Array<T> = [];
      return (extra, value) => {
        data.push(value);
        return callbackfn(extra, value, data.length - 1, data);
      };
    }
  }
}
