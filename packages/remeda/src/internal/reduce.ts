export default function reduce<
  Data,
  Args extends ReadonlyArray<unknown>,
  Result,
>(
  eager: (data: Data, ...args: Args) => Result,
  lazy: (...args: Args) => Iterator<void, Result, Data>,
  args: ReadonlyArray<unknown>,
): unknown {
  switch (eager.length - args.length) {
    case 0:
      return (eager as (...args: ReadonlyArray<unknown>) => unknown)(...args);
    case 1: {
      const dataLast = (data: Data): unknown => eager(data, ...(args as Args));
      dataLast.lazy = lazy(...(args as Args));
      dataLast.lazyKind = "reducer";
      return dataLast;
    }
    default:
      throw new Error("Wrong number of arguments");
  }
}
