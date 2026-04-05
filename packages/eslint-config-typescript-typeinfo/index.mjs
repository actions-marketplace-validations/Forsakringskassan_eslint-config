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

const strict = tseConfig.strictTypeCheckedOnly.reduce(merge, {});
const stylistic = tseConfig.stylisticTypeCheckedOnly.reduce(merge, {});

const defaultConfig = defineConfig({
    name: "@forsakringskassan/eslint-config-typescript-typeinfo",
    files: ["**/*.{ts,cts,mts}"],
    ignores: [
        "cypress.config.ts",
        "jest.config.{js,ts}",
        "jest.setup.{js,ts}",
        "vite.config.{ts,mts}",
    ],

    languageOptions: {
        parser: tseParser,
        sourceType: "module",
        parserOptions: {
            projectService: true,
        },
    },

    plugins: {
        "@typescript-eslint": tsePlugin,
    },

    rules: {
        ...strict.rules,
        ...stylistic.rules,

        /* disable overlapping rules from eslint-plugin-import */
        "import/named": "off",
        "import/namespace": "off",
        "import/default": "off",
        "import/no-named-as-default-member": "off",
        "import/no-unresolved": "off",
        "import/extensions": "off",

        /* no-explicit-any is enabled and for now this rule is a bit to tedious
         * to actually help */
        "@typescript-eslint/no-unsafe-member-access": "off",

        "@typescript-eslint/no-inferrable-types": "off",

        /* prefer interface over type = { .. } */
        "@typescript-eslint/consistent-type-definitions": [
            "error",
            "interface",
        ],

        /* enforce usage of "type" with export/import */
        "@typescript-eslint/consistent-type-exports": [
            "error",
            {
                fixMixedExportsWithInlineTypeSpecifier: true,
            },
        ],

        "@typescript-eslint/consistent-type-imports": [
            "error",
            {
                fixStyle: "inline-type-imports",
            },
        ],

        "@typescript-eslint/no-misused-promises": [
            "error",
            {
                checksVoidReturn: {
                    /* it is useful to use "async () => { ... }" even if the
                     * receiving function doesn't really handle the promise */
                    arguments: false,
                },
            },
        ],

        /* allow constructs such as `unknown | null`, while `unknown` does
         * override `null` it can still serve as a self-documenting type to
         * signal that `null` has a special meaning. It also helps when the type
         * is to be replaced with a better type later. */
        "@typescript-eslint/no-redundant-type-constituents": "off",

        /* allow expr === false */
        "@typescript-eslint/no-unnecessary-boolean-literal-compare": "off",

        /* allow numbers in template expressions */
        "@typescript-eslint/restrict-template-expressions": [
            "error",
            {
                allowAny: false,
                allowBoolean: false,
                allowNever: false,
                allowNullish: false,
                allowNumber: true,
                allowRegExp: false,
            },
        ],

        "tsdoc/syntax": "error",
    },
});

/**
 * @param {string | URL} [tsconfigRootDir]
 * @param {Config} [override]
 * @returns {Config}
 */
const config = (tsconfigrootDir, override) => {
    const merged = merge(defaultConfig, override ?? {});
    merged.languageOptions.parserOptions.tsconfigRootDir =
        tsconfigrootDir ?? process.cwd();
    return merged;
};
export default config;
