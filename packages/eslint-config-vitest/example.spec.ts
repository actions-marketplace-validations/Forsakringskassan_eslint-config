import { beforeEach, describe, expect, it, vi } from "vitest";
import { myAsyncFunction, myFunction } from "./my-file";

beforeEach(() => {
    vi.restoreAllMocks();
});

describe("should use describe and it", () => {
    it("should use toBeXYZ() over toEqual(xyz)", () => {
        expect.assertions(4);
        expect(null).toBeNull();
        expect(undefined).toBeUndefined();
        expect(true).toBeTruthy();
        expect(false).toBeFalsy();
    });

    it("should use toBe() for literals", () => {
        expect.assertions(2);
        expect(1).toBe(1);
        expect("foo").toBe("foo");
    });

    it("should use toEqual() for objects", () => {
        expect.assertions(1);
        const result = myFunction("foo");
        expect(result).toEqual({
            foo: 1,
            bar: expect.any(String),
            baz: expect.stringMatching(/spam/),
        });
    });

    it("should use toThrow() instead of try/catch", () => {
        expect.assertions(1);
        expect(() => {
            myFunction("invalid");
        }).toThrowError("Invalid value");
    });

    it("should use await for async tests", async () => {
        expect.assertions(1);
        const result = await myAsyncFunction();
        expect(result).toBeTruthy();
    });
});
