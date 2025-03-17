import { indexBy } from "./indexBy";
import { describeIterableArg } from "./internal/describeIterableArg";
import { pipe } from "./pipe";
import { prop } from "./prop";

describeIterableArg("indexBy", ({ wrap }) => {
  test("dataFirst", () => {
    expect(
      indexBy(
        wrap([
          { dir: "left", code: 97 },
          { dir: "right", code: 100 },
        ]),
        prop("code"),
      ),
    ).toStrictEqual({
      97: { dir: "left", code: 97 },
      100: { dir: "right", code: 100 },
    });
  });

  test("dataLast", () => {
    expect(
      pipe(
        wrap([
          { dir: "left", code: 97 },
          { dir: "right", code: 100 },
        ]),
        indexBy(prop("code")),
      ),
    ).toStrictEqual({
      97: { dir: "left", code: 97 },
      100: { dir: "right", code: 100 },
    });
  });
});
