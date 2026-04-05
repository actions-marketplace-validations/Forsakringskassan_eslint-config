/**
 * This is a sample file
 */
import "node:fs";
import "node:path";
import "eslint";
import { Component } from "@/components";
import { take } from "../parent";
import { add, hash } from "./utils";

export class Foo extends Component {
    /**
     * Brief description of function.
     *
     * Optional longer description with more details, examples and other
     * relevant information.
     *
     * @param {string} value - Description of parameter
     * @returns {string} Description of return value
     */
    myMethod(value) {
        return hash(value);
    }

    greet(to, from) {
        return `Hello, ${to} from ${from.join(",")}`;
    }

    static myStaticFunction(a) {
        function nestedFunction(b) {
            return add(a, b, this.value);
        }

        let x = nestedFunction(1);

        while (x-- < 10) {
            this.hello(x);
        }
    }
}

export function* fibonacci(current = 1, next = 1) {
    yield current;
    yield* fibonacci(next, current + next);
}

export const [first, second, ...rest] = take(fibonacci(), 10);

/**
 * @param {number} value
 * @returns {boolean}
 */
function complexCondition(value) {
    /* @TODO add more cases */
    switch (value) {
        case 1:
            return true;
        default:
            return value > 10;
    }
}

/**
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @returns {boolean}
 */
export function anyComplexCondition(a, b, c) {
    if (complexCondition(a)) {
        return true;
    }
    if (complexCondition(b)) {
        return true;
    }
    if (complexCondition(c)) {
        return true;
    }
    return false;
}

/**
 * @returns {Promise<void>}
 */
export async function asyncFunction() {
    await Promise.resolve();
}

await asyncFunction();

export function errorHandling() {
    while (complexCondition(1)) {
        try {
            /* ... */
        } catch (err) {
            if (err instanceof Error) {
                /* do nothing */
            }
        }
    }
}

/**
 * 5 params should be ok.
 *
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @param {number} d
 * @param {number} e
 * @returns {number[]}
 */
export function withManyParams(a, b, c, d, e) {
    return [a, b, c, d, e];
}

/* should prefer object shorthand */
const objProperty = 1;
export const obj = {
    objProperty,
};
