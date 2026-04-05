import tsdocPlugin from "eslint-plugin-tsdoc";
import {
    configs as tseConfig,
    parser as tseParser,
    plugin as tsePlugin,
} from "typescript-eslint";

/**
 * @typedef {import("eslint").Linter.Config} Config
 */

/**
 * @param {Config} config
 * @returns {Config}
 */
function defineConfig(config) {
    return config;
}

/**
 * @param {Config} result
 * @param {Config} it
 * @returns {Config}
 */
function merge(result, it) {
    return {
        ...result,
        ...it,
        languageOptions: { ...result.languageOptions, ...it.languageOptions },
        plugins: { ...result.plugins, ...it.plugins },
        rules: { ...result.rules, ...it.rules },
    };
}

const strict = tseConfig.strict.reduce(merge, {});
const stylistic = tseConfig.stylistic.reduce(merge, {});

const defaultConfig = defineConfig({
    name: "@forsakringskassan/eslint-config-typescript",
    files: ["**/*.{ts,cts,mts,vue}"],

    languageOptions: {
        parser: tseParser,
        parserOptions: {
            extraFileExtensions: [".svelte", ".vue"],
        },
        sourceType: "module",
    },

    plugins: {
        "@typescript-eslint": tsePlugin,
        tsdoc: tsdocPlugin,
    },

    rules: {
        ...strict.rules,
        ...stylistic.rules,

        /* Disabled as it is better to let typescript deal with this. For
         * instance, ESLint cannot detect when exhaustive checks are made and
         * the rest of the function is dead thus yielding false positives */
        "consistent-return": "off",

        /* prefer T[] for simple types, Array<T> for complex types (unions, etc) */
        "@typescript-eslint/array-type": ["error", { default: "array-simple" }],

        /* require all regular functions and methods to explicitly declare
         * return value type */
        "@typescript-eslint/explicit-function-return-type": [
            "error",
            {
                allowExpressions: true,
                allowHigherOrderFunctions: true,
                allowTypedFunctionExpressions: true,
            },
        ],

        /* require all members to specify "public", "private", etc */
        "@typescript-eslint/explicit-member-accessibility": "error",

        /* replace base max-params rule with @typescript-eslint/max-params */
        "max-params": "off",
        "@typescript-eslint/max-params": ["error", { max: 5 }],

        /* allow "const foo: number = 0" */
        "@typescript-eslint/no-inferrable-types": "off",

        /* allow function(this: void, ...) */
        "@typescript-eslint/no-invalid-void-type": [
            "error",
            {
                allowAsThisParameter: true,
            },
        ],

        /* allow constructs such as `unknown | null`, while `unknown` does override
         * `null` it can still serve as a self-documenting type to signal that
         * `null` has a special meaning. It also helps when the type is to be
         * replaced with a better type later. */
        "@typescript-eslint/no-redundant-type-constituents": "off",

        "@typescript-eslint/no-unused-vars": [
            "error",
            {
                /* allow `foo` to be unused when `{ foo, ...spread} = bar` is
                 * used to extract members from objects */
                ignoreRestSiblings: true,

                /* allow _ as prefix for intentionally unused variables */
                argsIgnorePattern: "^_",
            },
        ],

        /* allow overloading only if the parameters have different names */
        "@typescript-eslint/unified-signatures": [
            "error",
            {
                ignoreDifferentlyNamedParameters: true,
            },
        ],

        "tsdoc/syntax": "error",

        /* covered by @typescript-eslint/no-unused-vars */
        "sonarjs/no-dead-store": "off",

        /* disable unicorn rules covered by typescript or @typescript-eslint */
        "unicorn/no-new-array":
            "off" /* @typescript-eslint/no-array-constructor */,
        "unicorn/no-new-buffer": "off" /* @typescript-eslint/no-deprecated */,
        "unicorn/no-this-assignment":
            "off" /* @typescript-eslint/no-this-alias */,
        "unicorn/no-unnecessary-await":
            "off" /* @typescript-eslint/await-thenable */,
        "unicorn/prefer-includes":
            "off" /* @typescript-eslint/prefer-includes */,
        "unicorn/prefer-keyboard-event-key":
            "off" /* @typescript-eslint/no-deprecated */,
        "unicorn/prefer-string-starts-ends-with":
            "off" /* @typescript-eslint/prefer-string-starts-ends-with */,
    },
});

/**
 * @param {Config} [override]
 * @returns {Config}
 */
const config = (override) => merge(defaultConfig, override ?? {});
export default config;
