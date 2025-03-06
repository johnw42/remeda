export default function produce<
  Data,
  Args extends ReadonlyArray<unknown>,
  Result,
>(
  eager: (data: Data, ...args: Args) => Array<Result>,
  lazy: (data: Data, ...args: Args) => Iterator<Result, void, void>,
  args: ReadonlyArray<unknown>,
): unknown {
  switch (eager.length - args.length) {
    case 0:
      return (eager as (...args: ReadonlyArray<unknown>) => unknown)(...args);
    case 1: {
      const dataLast = (data: Data): unknown => eager(data, ...(args as Args));
      dataLast.lazy = (data: Data) => lazy(data, ...(args as Args));
      dataLast.lazyKind = "producer";
      return dataLast;
    }
    default:
      throw new Error("Wrong number of arguments");
  }
}
