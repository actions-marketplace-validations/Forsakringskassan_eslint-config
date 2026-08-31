import jestPlugin from "eslint-plugin-jest";

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

const recommended = jestPlugin.configs["flat/recommended"];
const style = jestPlugin.configs["flat/style"];

const defaultConfig = defineConfig({
    name: "@forsakringskassan/eslint-config-jest",
    files: ["**/*.spec.{js,ts,cjs,mjs,mts}"],
    ignores: ["cypress/**", "tests/e2e/**"],

    languageOptions: {
        globals: {
            ...recommended.languageOptions.globals,
        },
    },

    plugins: {
        jest: jestPlugin,
    },

    rules: {
        ...recommended.rules,
        ...style.rules,

        "@typescript-eslint/no-non-null-assertion": "off",

        /* jest functions often use "any" */
        "@typescript-eslint/no-unsafe-assignment": "off",

        "jest/consistent-test-it": ["error", { fn: "it" }],
        "jest/no-alias-methods": "error",
        "jest/no-conditional-in-test": "error",
        "jest/no-disabled-tests": "warn",
        "jest/no-duplicate-hooks": "error",
        "jest/no-focused-tests": "warn",
        "jest/no-large-snapshots": [
            "error",
            { maxSize: 25, inlineMaxSize: 10 },
        ],
        "jest/no-test-prefixes": "warn",
        "jest/no-test-return-statement": "error",
        "jest/padding-around-after-all-blocks": "warn",
        "jest/padding-around-after-each-blocks": "warn",
        "jest/padding-around-before-all-blocks": "warn",
        "jest/padding-around-before-each-blocks": "warn",
        "jest/padding-around-describe-blocks": "warn",
        "jest/padding-around-expect-groups": "off",
        "jest/padding-around-test-blocks": "warn",
        "jest/prefer-comparison-matcher": "error",
        "jest/prefer-equality-matcher": "error",
        "jest/prefer-expect-assertions": "error",
        "jest/prefer-hooks-in-order": "error",
        "jest/prefer-hooks-on-top": "error",
        "jest/prefer-importing-jest-globals": "error",
        "jest/prefer-jest-mocked": "error",
        "jest/prefer-lowercase-title": "off", // Disabled since we want to allow uppercase titles when for example testing Classes or Vue Components.
        "jest/prefer-mock-promise-shorthand": "error",
        "jest/prefer-spy-on": "error",
        "jest/prefer-todo": "error",

        /* jest uses @jest-* tags for per-file configuration */
        "tsdoc/syntax": "off",

        "unicorn/consistent-function-scoping": "off",

        /* allow either kebab-case or PascalCase for testcases, it should match the file under test */
        "unicorn/filename-case": [
            "error",
            {
                cases: {
                    kebabCase: true,
                    pascalCase: true,
                },
                checkDirectories: false,
            },
        ],

        "unicorn/no-non-function-verb-prefix": "off", // interferes with jest.spyOn()
        "unicorn/no-top-level-assignment-in-function": "off", // variables are often assigned from {beforeEach,beforeAll} */
    },
});

/**
 * @param {Config} [override]
 * @returns {Config}
 */
const config = (override) => merge(defaultConfig, override ?? {});
export default config;
