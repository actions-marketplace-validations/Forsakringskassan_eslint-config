<script setup lang="ts">
/**
 * This is a sample file for typescript inside vue. It is a copy of the
 * typescript example file and should be kept in sync.
 */

import { type FooInterface, Component } from "@/components";
import { add, hash, join, take } from "./utils";

/* variables with _ prefix should be allowed to be unused */
function sink(..._unused: unknown[]): void {
    /* do nothing */
}

enum MyEnum {
    FOO,
    BAR,
}

const myVar = 0;
const unknownOrNull: unknown | null = null;
const plainArray: string[] = [];
const complexArray: Array<{ foo: string }> = [];

class Foo extends Component implements FooInterface {
    /**
     * Brief description of function.
     *
     * Optional longer description with more details, examples and other
     * relevant information.
     *
     * @param value - Description of parameter
     * @returns Description of return value
     */
    public myMethod(value: string): string {
        return hash(value);
    }

    private async greet(to: string, from: string[]): Promise<string> {
        const joined = await join(from);
        const meaning = 42;
        return `Hello, ${to} from ${joined}! ${meaning}`;
    }

    public static async myStaticFunction(c: number): Promise<void> {
        function nestedFunction<T extends number>(a: T, b: T): number {
            return add(a, b, c);
        }

        let x = nestedFunction(1, 2);

        const foo = new Foo();
        while (x-- < 10) {
            await foo.greet("me", ["you"]);
        }
    }
}

function* fibonacci(current = 1, next = 1): Generator<number> {
    yield current;
    yield* fibonacci(next, current + next);
}

function handleMyEnum(value: MyEnum): string {
    switch (value) {
        case MyEnum.FOO:
            return "foo";
        case MyEnum.BAR:
            return "bar";
    }
    /* the rest of the function is dead as all possible values of `MyEnum` are
     * checked, should not yield any errors */
}

const [first, second, ...rest] = take(fibonacci(), 10);

/* "a" should be allowed to be unused as the `{ a, ...spread }` statement to get
 * a new object without "a" present. */
const foo = { a: 1, b: 2, c: 3 };
const { a, ...fooWithoutA } = foo;

sink(fooWithoutA);

function callbackWithoutThis(this: void): void {
    /* do nothing */
}

function overloaded(a: number): void;
function overloaded(b: string): void;
function overloaded(_value: number | string): void {
    /* do nothing */
}

/* 5 params should be ok (excluding this) */
function withManyParams(this: void, a: number, b: number, c: number, d: number, e: number): number[] {
    return [a, b, c, d, e];
}

/* should prefer object shorthand */
const objProperty = 1;
const obj = {
    objProperty,
};

function fnExpectingVoidCallback(cb: () => void): void {
    cb();
}

fnExpectingVoidCallback(async () => {
    await Promise.resolve();
});

callbackWithoutThis();
overloaded(1);
const fooInstance = new Foo();
const data = {
    myVar,
    unknownOrNull,
    plainArray,
    complexArray,
    foo: fooInstance.myMethod("foo"),
    myEnum: handleMyEnum(MyEnum.FOO),
    first,
    second,
    rest,
    withManyParams: withManyParams(1, 2, 3, 4, 5),
    obj,
};
</script>

<template>
    <pre>{{ data }}</pre>
</template>
