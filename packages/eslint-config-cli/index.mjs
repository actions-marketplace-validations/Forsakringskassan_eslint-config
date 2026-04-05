import globals from "globals";

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

const defaultConfig = defineConfig({
    name: "@forsakringskassan/eslint-config-cli",
    files: [
        "*.{js,ts,cjs,mjs}",
        "**/scripts/*.{js,ts,cjs,mjs}",
        "{internal,packages}/*/*.{js,ts,cjs,mjs}",
    ],
    languageOptions: {
        globals: {
            ...globals.node,
        },
    },
    rules: {
        "no-console": "off",
    },
});

/**
 * @param {Config} [override]
 * @returns {Config}
 */
const config = (override) => merge(defaultConfig, override ?? {});
export default config;
