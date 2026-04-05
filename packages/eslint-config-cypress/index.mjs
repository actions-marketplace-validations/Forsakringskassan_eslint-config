import cypressPlugin from "eslint-plugin-cypress";
import mochaPlugin from "eslint-plugin-mocha";

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

const globals = cypressPlugin.configs.globals;
const recommended = cypressPlugin.configs.recommended;

const defaultConfig = defineConfig({
    name: "@forsakringskassan/eslint-config-cypress",
    files: ["**/*.cy.[jt]s", "cypress/support/**/*.[jt]s"],

    languageOptions: {
        ecmaVersion: 2019,
        sourceType: "module",
        globals: {
            ...globals.languageOptions.globals,
        },
    },

    plugins: {
        cypress: cypressPlugin,
        mocha: mochaPlugin,
    },

    rules: {
        ...recommended.rules,

        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/triple-slash-reference": "off",
        "mocha/no-exclusive-tests": "warn",
        "mocha/no-identical-title": "error",
        "mocha/no-pending-tests": "warn",

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
