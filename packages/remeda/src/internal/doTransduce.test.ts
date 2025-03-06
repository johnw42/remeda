/* eslint-disable @typescript-eslint/explicit-function-return-type --
 * doTransduce is all about functions, so we need to turn these off to make it easy
 * to write the tests.
 */

import doTransduce from "./doTransduce";
import type { LazyTransducer } from "./types/LazyFunc";

test("throws on wrong number of arguments", () => {
  expect(() =>
    zeroArgsPurried(
      // The first argument to the lazy purried function will always be an
      // array.
      ["hello"],
      // But from the second param and onward the params belong to the lazy
      // impl. Because our lazy impl takes 0 args, this extra param should
      // throw.
      "world",
    ),
  ).toThrow("Wrong number of arguments");
});

const zeroArgsPurried = (...args: ReadonlyArray<unknown>) =>
  doTransduce(undefined, zeroArgsLazyImpl, args);

/* v8 ignore next 4 -- We only need the function pointer, we never call it! */
const zeroArgsLazyImpl = () => evaluator;
const evaluator: LazyTransducer = () => {
  throw new Error("unreachable");
};
