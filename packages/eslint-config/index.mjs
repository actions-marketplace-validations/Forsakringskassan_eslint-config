import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import eslintCommentsPlugin from "@eslint-community/eslint-plugin-eslint-comments";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import sonarjsPlugin from "eslint-plugin-sonarjs";
import globals from "globals";

export { default as globals } from "globals";

/**
 * @typedef {import("eslint").Linter.Config} Config
 * @typedef {import("eslint").Linter.RulesRecord} RulesRecord
 */

/**
 * @param {Config} config
 * @returns {Config}
 */
export function defineConfig(config) {
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

/**
 * @param {RulesRecord} rules
 * @param {(rule: string) => boolean} predicate
 * @returns {RulesRecord}
 */
function filterRules(rules, predicate) {
    return Object.fromEntries(
        Object.entries(rules).filter(([key]) => predicate(key)),
    );
}

export default [
    defineConfig({
        ...js.configs.recommended,
    }),

    defineConfig({
        plugins: {
            prettier: prettierPlugin,
            import: importPlugin,
            "@eslint-community/eslint-comments": eslintCommentsPlugin,
            sonarjs: sonarjsPlugin,
        },
        settings: {
            "import/resolver": {
                [fileURLToPath(
                    import.meta.resolve("eslint-import-resolver-node"),
                )]: true,
                [fileURLToPath(
                    import.meta.resolve("eslint-import-resolver-typescript"),
                )]: true,
            },
        },
        rules: {
            ...filterRules(prettierConfig.rules, (rule) => {
                if (rule.startsWith("@stylistic/")) {
                    return false;
                }
                if (rule.startsWith("@babel/") || rule.startsWith("babel/")) {
                    return false;
                }
                if (rule.startsWith("flowtype/")) {
                    return false;
                }
                if (rule.startsWith("react/")) {
                    return false;
                }
                if (rule.startsWith("standard/")) {
                    return false;
                }
                if (rule.startsWith("unicorn/")) {
                    return false;
                }
                return true;
            }),
            ...prettierPlugin.configs.recommended.rules,
            ...importPlugin.configs.errors.rules,
            ...eslintCommentsPlugin.configs.recommended.rules,
            ...sonarjsPlugin.configs.recommended.rules,
        },
    }),

    defineConfig({
        name: "@forsakringskassan/eslint-config/rules",
        rules: {
            camelcase: "error",
            complexity: ["error", 20],
            "consistent-return": "error",
            curly: "error",
            eqeqeq: "error",
            "max-depth": ["error", 3],
            "max-params": ["error", { max: 5 }],
            "no-eval": "error",
            "no-implied-eval": "error",
            "no-loop-func": "error",
            "no-new": "error",
            "no-new-func": "error",
            "no-unreachable": "error",
            "no-unused-vars": "error",
            "no-var": "error",
            "no-warning-comments": "error",
            "object-shorthand": "error",
            "prefer-const": "error",
            "prefer-rest-params": "error",
            "prefer-spread": "error",
            "prefer-template": "error",
            radix: "error",
            yoda: "error",

            "@eslint-community/eslint-comments/disable-enable-pair": [
                "error",
                { allowWholeFile: true },
            ],
            "@eslint-community/eslint-comments/require-description": [
                "error",
                {
                    ignore: [
                        "eslint-enable",
                        "eslint-env",
                        "exported",
                        "global",
                        "globals",
                    ],
                },
            ],
            "@eslint-community/eslint-comments/no-unused-disable": "error",

            /* Use eslint native complexity rule instead */
            "sonarjs/cognitive-complexity": "off",

            /* Prefer to use multiple returns even for booleans (looks better and
             * can yield performance increase), see example of this in
             * "example.js". */
            "sonarjs/prefer-single-boolean-return": "off",

            /* This rule is deemed to provide more trouble than actual value.
             * Especially because of the prevalence of translations, i.e., text
             * keys. */
            "sonarjs/no-duplicate-string": "off",

            "sonarjs/argument-type": "off", // handled by typescript (and this rule is sometimes wrong)
            "sonarjs/arguments-order": "off", // another slow rule, would be nice to have enabled thought
            "sonarjs/deprecation": "off", // covered by @typescript-eslint/no-deprecated (and this rule crashes on .svelte files)
            "sonarjs/function-return-type": "off", // overly broad and opinionated, let typescript deal with this
            "sonarjs/no-commented-code": "off", // neat rule but is very very slow (over 50% of the total linting time)
            "sonarjs/no-control-regex": "off", // covered by no-control-regexp
            "sonarjs/no-empty-test-file": "off", // could be useful but it does not handle it.each or similar constructs thus yields more false positives than its worth */
            "sonarjs/no-selector-parameter": "off", // not always possible (e.g. watcher handler in vue)
            "sonarjs/no-skipped-tests": "off", // covered by jest/no-disabled-tests and mocha/no-pending-tests
            "sonarjs/no-small-switch": "off", // prefer to use small switches when the intention is to all more cases later
            "sonarjs/no-unused-vars": "off", // covered by @typescript-eslint/no-unused-vars
            "sonarjs/prefer-nullish-coalescing": "off", // requires typescript and strictNullChecks, which is sane, but we also use @typescript-eslint/prefer-nullish-coalescing so this becomes redundant
            "sonarjs/prefer-regexp-exec": "off", // covered by @typescript-eslint/prefer-regexp-exec
            "sonarjs/redundant-type-aliases": "off", // "redundant" type aliases helps with self-documenting code
            "sonarjs/todo-tag": "off", // want to be able to leave todo tasks
            "sonarjs/unused-import": "off", // covered by @typescript-eslint/no-unused-vars
            "sonarjs/unused-named-groups": "off", // named groups can help readability even if not used
            "sonarjs/use-type-alias": "off", // overly broad, lets leave this to the discretion of the author

            /* disable sonarjs aws related rules as we dont use aws */
            "sonarjs/aws-apigateway-public-api": "off",
            "sonarjs/aws-ec2-rds-dms-public": "off",
            "sonarjs/aws-ec2-unencrypted-ebs-volume": "off",
            "sonarjs/aws-efs-unencrypted": "off",
            "sonarjs/aws-iam-all-privileges": "off",
            "sonarjs/aws-iam-all-resources-accessible": "off",
            "sonarjs/aws-iam-privilege-escalation": "off",
            "sonarjs/aws-iam-public-access": "off",
            "sonarjs/aws-opensearchservice-domain": "off",
            "sonarjs/aws-rds-unencrypted-databases": "off",
            "sonarjs/aws-restricted-ip-admin-access": "off",
            "sonarjs/aws-s3-bucket-granted-access": "off",
            "sonarjs/aws-s3-bucket-insecure-http": "off",
            "sonarjs/aws-s3-bucket-public-access": "off",
            "sonarjs/aws-s3-bucket-server-encryption": "off",
            "sonarjs/aws-s3-bucket-versioning": "off",
            "sonarjs/aws-sagemaker-unencrypted-notebook": "off",
            "sonarjs/aws-sns-unencrypted-topics": "off",
            "sonarjs/aws-sqs-unencrypted-queue": "off",

            /* Lower some errors to warnings, these are allowed on local builds (to
             * not prevent builds during development where code is unfinished and
             * might contain debugging code) but is disallowed when building from
             * Jenkins (via `--max-warnings 0`) */
            "no-console": "warn",
            "no-debugger": "warn",
            "prettier/prettier": "warn",

            "import/default": "off",
            "import/extensions": [
                "error",
                "never",
                {
                    css: "always",
                    json: "always",
                },
            ],
            "import/newline-after-import": "error",
            "import/no-absolute-path": "error",
            "import/no-deprecated": "error",
            "import/no-duplicates": "error",
            "import/no-dynamic-require": "error",
            "import/no-extraneous-dependencies": "error",
            "import/no-mutable-exports": "error",
            "import/no-named-as-default": "error",
            "import/no-named-as-default-member": "error",
            "import/no-named-default": "error",
            "import/no-unresolved": [
                "error",
                {
                    /* neither of the resolvers will handle @ alias */
                    ignore: ["^@"],
                },
            ],
            "import/no-useless-path-segments": "error",
            "import/order": [
                "error",
                {
                    pathGroups: [
                        {
                            pattern: "{vue,vite}",
                            group: "external",
                            position: "before",
                        },
                        {
                            pattern: "{cypress,cypress/vue}",
                            group: "external",
                            position: "before",
                        },
                        {
                            pattern: "@/**",
                            group: "parent",
                            position: "before",
                        },
                    ],
                    pathGroupsExcludedImportTypes: ["builtin", "object"],
                    alphabetize: {
                        order: "asc",
                        orderImportKind: "asc",
                    },
                    named: {
                        enabled: true,
                        types: "types-first",
                    },
                },
            ],
        },
    }),

    defineConfig({
        name: "@forsakringskassan/eslint-config/globals",
        languageOptions: {
            globals: {
                ...globals.es6,
                ...globals.node,
            },
        },
    }),

    defineConfig({
        name: "@forsakringskassan/eslint-config/ecma-version",
        languageOptions: {
            ecmaVersion: 2024,
            sourceType: "module",
        },
    }),

    defineConfig({
        /* ensure cjs and mjs files are linted too */
        name: "@forsakringskassan/eslint-config/extensions",
        files: ["**/*.cjs", "**/*.mjs"],
    }),

    defineConfig({
        /* mjs requires file extension */
        name: "@forsakringskassan/eslint-config/esm",
        files: ["**/*.mjs"],
        rules: {
            /* Could be removed once https://github.com/import-js/eslint-plugin-import/issues/3189 is fixed */
            "import/extensions": ["error", "always", { ignorePackages: true }],
        },
    }),

    /* These legacy files points to compiled files which may or may not exist
     * yet */
    defineConfig({
        name: "@forsakringskassan/eslint-config/legacy-dts",
        files: ["*.d.ts", "packages/*/*.d.ts"],
        rules: {
            "import/no-unresolved": "off",
        },
    }),

    defineConfig({
        name: "@forsakringskassan/eslint-config/bin",
        files: ["bin/*.{js,cjs,mjs}"],
        rules: {
            /* esm requires the usage of extension in this context */
            "import/extensions": "off",
            /* needed to run eslint before sources are compiled to dist folder */
            "import/no-unresolved": "off",
        },
    }),

    /* E2E tests may import pageobjects from monorepo packages but the import
     * plugin wont resolve them, yielding lots of false positives */
    {
        name: "@forsakringskassan/eslint-config/cypress-pageobjects",
        files: ["cypress/**/*.[jt]s"],
        rules: {
            "import/no-extraneous-dependencies": "off",
            "import/order": "off",
        },
    },
];

const defaultAppConfig = defineConfig({
    name: "@forsakringskassan/eslint-config/app",
    rules: {
        "sonarjs/no-commented-code": "warn",
        "vue/no-restricted-block": "off",
    },
});

const defaultDocsConfig = defineConfig({
    name: "@forsakringskassan/eslint-config/docs-app",
    files: ["docs/src/*.{js,ts}"],
    languageOptions: {
        globals: {
            ...globals.browser,
        },
    },
});

const defaultExampleConfig = {
    name: "@forsakringskassan/eslint-config/docs-examples",
    files: ["**/examples/**/*.{js,ts,vue}"],
    rules: {
        "@eslint-community/eslint-comments/require-description": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "import/no-duplicates": "off",
        "import/no-extraneous-dependencies": "off",
        "no-console": "off",
        "no-unused-vars": "off",
        "sonarjs/no-dead-store": "off",
        "sonarjs/pseudo-random": "off",
    },
};

const defaultSandboxConfig = {
    name: "@forsakringskassan/eslint-config/sandbox",
    files: ["internal/vue-sandbox/**/*.{js,ts,vue}"],
    rules: {
        "no-console": "off",
    },
};

/**
 * @param {Config} [override]
 * @returns {Config}
 */
export function appConfig(override) {
    return merge(defaultAppConfig, override ?? {});
}

/**
 * @param {Config} [override]
 * @returns {Config}
 */
export function docsConfig(override) {
    return merge(defaultDocsConfig, override ?? {});
}

/**
 * @param {Config} [override]
 * @returns {Config}
 */
export function examplesConfig(override) {
    return merge(defaultExampleConfig, override ?? {});
}

/**
 * @param {Config} [override]
 * @returns {Config}
 */
export function sandboxConfig(override) {
    return merge(defaultSandboxConfig, override ?? {});
}
