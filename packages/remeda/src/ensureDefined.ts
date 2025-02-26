import { purry } from "./purry";

export function ensureDefined<T>(value: T | undefined): T;
export function ensureDefined<T>(): (value: T | undefined) => T;
export function ensureDefined(...args: ReadonlyArray<unknown>): unknown {
  return purry(ensureDefinedImplementation, args);
}

function ensureDefinedImplementation<T>(value: T | undefined): T {
  if (value === undefined) {
    throw new Error("Value is undefined");
  }
  return value;
}
