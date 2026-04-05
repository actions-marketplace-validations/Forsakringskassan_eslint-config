import sveltePlugin from "eslint-plugin-svelte";
import globals from "globals";
import svelteParser from "svelte-eslint-parser";
import { parser as tseParser } from "typescript-eslint";

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

const recommended = sveltePlugin.configs["recommended"].reduce(merge, {});

const defaultConfig = defineConfig({
    name: "@forsakringskassan/eslint-config-svelte",
    files: ["**/*.svelte", "**/*.svelte.[jt]s"],

    languageOptions: {
        parser: svelteParser,
        parserOptions: {
            extraFileExtensions: [".svelte", ".vue"],
            parser: tseParser,
        },
        globals: {
            ...globals.browser,
        },
    },

    plugins: {
        svelte: sveltePlugin,
    },

    processor: sveltePlugin.processors.svelte,

    rules: {
        ...recommended.rules,
    },
});

/**
 * @param {Config} [override]
 * @returns {Config}
 */
const config = (override) => merge(defaultConfig, override ?? {});
export default config;
