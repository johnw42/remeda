import { lazyIdentityEvaluator } from "./utilityEvaluators";

describe("utilityEvaluator", () => {
  test("lazyIdentityEvaluator", () => {
    const transducer = lazyIdentityEvaluator<number>();

    expect(transducer(1)).toStrictEqual({
      value: [1],
      done: false,
    });
    expect(transducer(2)).toStrictEqual({
      value: [2],
      done: false,
    });
  });
});
