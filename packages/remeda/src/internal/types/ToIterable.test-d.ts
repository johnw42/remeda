import type ToIterable from "./ToIterable";

expectTypeOf<ToIterable<Array<boolean> | Array<string>>>().toEqualTypeOf<
  Iterable<boolean | string>
>();
