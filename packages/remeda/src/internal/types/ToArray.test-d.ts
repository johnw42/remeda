import type AnyIterable from "./AnyIterable";
import type ToArray from "./ToArray";

expectTypeOf<ToArray<AnyIterable>>().toEqualTypeOf<Array<unknown>>();
expectTypeOf<ToArray<Iterable<unknown>>>().toEqualTypeOf<Array<unknown>>();
expectTypeOf<ToArray<Iterable<number | string>>>().toEqualTypeOf<
  Array<number | string>
>();
expectTypeOf<ToArray<ReadonlyArray<number | string>>>().toEqualTypeOf<
  Array<number | string>
>();
expectTypeOf<
  ToArray<ReadonlyArray<number> | ReadonlyArray<string>>
>().toEqualTypeOf<Array<number> | Array<string>>();
expectTypeOf<ToArray<[]>>().toEqualTypeOf<[]>();
expectTypeOf<ToArray<ReadonlyArray<never>>>().toEqualTypeOf<Array<never>>();
expectTypeOf<ToArray<readonly []>>().toEqualTypeOf<[]>();
expectTypeOf<ToArray<readonly [1, 2, 3]>>().toEqualTypeOf<[1, 2, 3]>();
