import type ArrayToIterable from "./ArrayToIterable";

expectTypeOf<ArrayToIterable<Array<boolean> | Array<string>>>().toEqualTypeOf<
  Iterable<boolean | string>
>();
