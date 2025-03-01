import { describe, it, expect } from "vitest";
import { handleEnsureError } from "./handleEnsureError";
import type { EnsureOpts } from "./types/EnsureOpts";

describe("handleEnsureError", () => {
  it("should return the default value if opts.default is provided", () => {
    const value = "test";
    const opts: EnsureOpts<string> = { default: "defaultValue" };
    const result = handleEnsureError(value, opts, "defaultMessage");

    expect(result).toBe("defaultValue");
  });

  it("should throw an error with the default message if opts is undefined", () => {
    const value = "test";
    const defaultMessage = "defaultMessage";

    expect(() => handleEnsureError(value, undefined, defaultMessage)).toThrow(
      defaultMessage,
    );
  });

  it("should throw an error with the provided message if opts.message is a string", () => {
    const value = "test";
    const opts: EnsureOpts<string> = { message: "customMessage" };

    expect(() => handleEnsureError(value, opts, "defaultMessage")).toThrow(
      "customMessage",
    );
  });

  it("should throw an error with the message returned by opts.message function", () => {
    const value = "test";
    const opts: EnsureOpts<string> = {
      message: (val) => `customMessage: ${val}`,
    };

    expect(() => handleEnsureError(value, opts, "defaultMessage")).toThrow(
      "customMessage: test",
    );
  });
});
