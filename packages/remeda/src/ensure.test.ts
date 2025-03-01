import { ensure } from "./ensure";
import { handleEnsureError } from "./internal/handleEnsureError";

vi.mock("./internal/handleEnsureError", () => ({
  handleEnsureError: vi.fn<() => unknown>(),
}));

describe("ensure", () => {
  const handleEnsureErrorResult = Symbol("handleEnsureErrorResult");

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(handleEnsureError).mockReturnValue(handleEnsureErrorResult);
  });

  it("should return the value if the predicate returns true", () => {
    expect(ensure(5, (x) => x > 0)).toBe(5);
    expect(handleEnsureError).not.toHaveBeenCalled();
  });

  it("should return the value from handleEnsureError if the predicate returns false", () => {
    expect(ensure(5, (x: number): boolean => x < 0)).toBe(
      handleEnsureErrorResult,
    );
    expect(handleEnsureError).toHaveBeenCalledWith(
      5,
      expect.anything(),
      "Invalid value",
    );
  });

  it("should return the value from handleEnsureError if the predicate returns false and extra options are passed", () => {
    const opts = { default: handleEnsureErrorResult as unknown as number };

    expect(ensure(5, (x) => x < 0, opts)).toBe(handleEnsureErrorResult);
    expect(handleEnsureError).toHaveBeenCalledWith(5, opts, "Invalid value");
  });

  it("should return the value if the `test` predicate returns true", () => {
    expect(ensure(5, { test: (x) => x > 0 })).toBe(5);
    expect(handleEnsureError).not.toHaveBeenCalled();
  });

  it("should return the value from handleEnsureError if the `test` predicate returns false", () => {
    const opts = { test: (x: number) => x < 0 };

    expect(ensure(5, opts)).toBe(handleEnsureErrorResult);
    expect(handleEnsureError).toHaveBeenCalledWith(5, opts, "Invalid value");
  });

  it("should return the value if the `not` predicate returns false", () => {
    expect(ensure(5, { not: (x) => x < 0 })).toBe(5);
    expect(handleEnsureError).not.toHaveBeenCalled();
  });

  it("should return the value from handleEnsureError if the `not` predicate returns true", () => {
    const opts = { not: (x: number) => x > 0 };

    expect(ensure(5, opts)).toBe(handleEnsureErrorResult);
    expect(handleEnsureError).toHaveBeenCalledWith(5, opts, "Invalid value");
  });

  it("should return the value if the type matches", () => {
    expect(ensure(5, { type: "number" })).toBe(5);
    expect(handleEnsureError).not.toHaveBeenCalled();
  });

  it("should return the value from handleEnsureError if the type does not match", () => {
    const opts = { type: "string" } as const;

    expect(ensure(5 as unknown, opts)).toBe(handleEnsureErrorResult);
    expect(handleEnsureError).toHaveBeenCalledWith(5, opts, "Invalid value");
  });

  it("should return a function that ensures the value with `test`", () => {
    const opts = { test: (x: number) => x > 0 };
    const fn = ensure(opts);

    expect(fn(5)).toBe(5);
    expect(handleEnsureError).not.toHaveBeenCalled();

    expect(fn(-5)).toBe(handleEnsureErrorResult);
    expect(handleEnsureError).toHaveBeenCalledWith(-5, opts, "Invalid value");
  });

  it("should return a function that ensures the value with `not`", () => {
    const opts = { not: (x: number) => x < 0 };
    const fn = ensure(opts);

    expect(fn(5)).toBe(5);
    expect(handleEnsureError).not.toHaveBeenCalled();

    expect(fn(-5)).toBe(handleEnsureErrorResult);
    expect(handleEnsureError).toHaveBeenCalledWith(-5, opts, "Invalid value");
  });

  it("should return a function that ensures the value with `type`", () => {
    const opts = { type: "number" } as const;
    const fn = ensure(opts);

    expect(fn(5)).toBe(5);
    expect(handleEnsureError).not.toHaveBeenCalled();

    expect(fn("not a number")).toBe(handleEnsureErrorResult);
    expect(handleEnsureError).toHaveBeenCalledWith(
      "not a number",
      opts,
      "Invalid value",
    );
  });
});
