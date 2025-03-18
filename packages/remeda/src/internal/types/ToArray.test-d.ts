import type AnyIterable from "./AnyIterable";
import type { ToArrayOrTuple } from "./ToArray";

expectTypeOf<ToArrayOrTuple<AnyIterable>>().toEqualTypeOf<Array<unknown>>();
expectTypeOf<ToArrayOrTuple<Iterable<unknown>>>().toEqualTypeOf<
  Array<unknown>
>();
expectTypeOf<ToArrayOrTuple<Iterable<number | string>>>().toEqualTypeOf<
  Array<number | string>
>();
expectTypeOf<ToArrayOrTuple<ReadonlyArray<number | string>>>().toEqualTypeOf<
  Array<number | string>
>();
expectTypeOf<
  ToArrayOrTuple<ReadonlyArray<number> | ReadonlyArray<string>>
>().toEqualTypeOf<Array<number> | Array<string>>();
expectTypeOf<ToArrayOrTuple<[]>>().toEqualTypeOf<[]>();
expectTypeOf<ToArrayOrTuple<ReadonlyArray<never>>>().toEqualTypeOf<
  Array<never>
>();
expectTypeOf<ToArrayOrTuple<readonly []>>().toEqualTypeOf<[]>();
expectTypeOf<ToArrayOrTuple<readonly [1, 2, 3]>>().toEqualTypeOf<[1, 2, 3]>();
