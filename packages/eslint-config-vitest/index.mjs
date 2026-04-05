import vitest from "@vitest/eslint-plugin";

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

const { configs } = vitest;

const defaultConfig = defineConfig({
    name: "@forsakringskassan/eslint-config-vitest",
    files: ["**/*.spec.{js,ts,cjs,mjs,mts}"],
    ignores: ["cypress/**", "tests/e2e/**"],

    plugins: {
        vitest,
    },

    rules: {
        ...configs.recommended.rules,

        "vitest/consistent-test-it": [
            "error",
            { fn: "it", withinDescribe: "it" },
        ],
        "vitest/consistent-vitest-vi": ["error", { fn: "vi" }],
        "vitest/expect-expect": "warn",
        "vitest/hoisted-apis-on-top": "error",
        "vitest/no-alias-methods": "error",
        "vitest/no-commented-out-tests": "warn",
        "vitest/no-conditional-expect": "error",
        "vitest/no-conditional-in-test": "error",
        "vitest/no-conditional-tests": "error",
        "vitest/no-disabled-tests": "warn",
        "vitest/no-focused-tests": "warn",
        "vitest/no-interpolation-in-snapshots": "error",
        "vitest/no-mocks-import": "error",
        "vitest/no-standalone-expect": "error",
        "vitest/no-test-prefixes": "warn",
        "vitest/no-test-return-statement": "error",
        "vitest/padding-around-after-all-blocks": "warn",
        "vitest/padding-around-after-each-blocks": "warn",
        "vitest/padding-around-before-all-blocks": "warn",
        "vitest/padding-around-before-each-blocks": "warn",
        "vitest/padding-around-describe-blocks": "warn",
        "vitest/padding-around-expect-groups": "off",
        "vitest/padding-around-test-blocks": "warn",
        "vitest/prefer-comparison-matcher": "error",
        "vitest/prefer-equality-matcher": "error",
        "vitest/prefer-expect-assertions": "error",
        "vitest/prefer-expect-type-of": "error",
        "vitest/prefer-hooks-in-order": "error",
        "vitest/prefer-hooks-on-top": "error",
        "vitest/prefer-import-in-mock": "error",
        "vitest/prefer-importing-vitest-globals": "error",
        "vitest/prefer-lowercase-title": "error",
        "vitest/prefer-mock-promise-shorthand": "error",
        "vitest/prefer-spy-on": "error",
        "vitest/prefer-to-be": "error",
        "vitest/prefer-to-contain": "error",
        "vitest/prefer-to-have-length": "error",
        "vitest/prefer-todo": "error",
        "vitest/prefer-vi-mocked": "error",
        "vitest/valid-expect": "error",
        "vitest/valid-title": "error",

        "@typescript-eslint/no-non-null-assertion": "off",

        /* jest functions often use "any" */
        "@typescript-eslint/no-unsafe-assignment": "off",

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
            },
        ],
    },
});

/**
 * @param {Config} [override]
 * @returns {Config}
 */
const config = (override) => merge(defaultConfig, override ?? {});
export default config;
