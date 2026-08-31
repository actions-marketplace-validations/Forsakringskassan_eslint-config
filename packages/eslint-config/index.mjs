import js from "@eslint/js";
import eslintCommentsPlugin from "@eslint-community/eslint-plugin-eslint-comments";
import prettierConfig from "eslint-config-prettier";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import { createNodeResolver, importX } from "eslint-plugin-import-x";
import prettierPlugin from "eslint-plugin-prettier";
import regexpPlugin from "eslint-plugin-regexp";
import sonarjsPlugin from "eslint-plugin-sonarjs";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
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
    const entries = Object.entries(rules).filter(([key]) => predicate(key));
    return Object.fromEntries(entries);
}

/**
 * Returns true if rule is configured with error severity.
 *
 * @returns {boolean}
 */
function isErrorSeverity(config) {
    if (Array.isArray(config)) {
        config = config[0];
    }
    return config === "error";
}

/**
 * Downgrades errors to warnings.
 *
 * | input   | output |
 * |---------|--------|
 * | "error" | "warn" |
 * | "warn"  | "warn" |
 * | "off"   | "off"  |
 *
 * @param {RulesRecord} rules
 * @param {string[]} list
 * @returns {RulesRecord}
 */
function downgradeToWarning(rules, list) {
    const entries = Object.entries(rules).map(([key, config]) => {
        if (list.includes(key) && isErrorSeverity(config)) {
            config = "warn";
        }
        return [key, config];
    });
    return Object.fromEntries(entries);
}

export default [
    defineConfig({
        ...js.configs.recommended,
    }),

    defineConfig({
        plugins: {
            prettier: prettierPlugin,
            "import-x": importX,
            "@eslint-community/eslint-comments": eslintCommentsPlugin,
            regexp: regexpPlugin,
            sonarjs: sonarjsPlugin,
            unicorn: eslintPluginUnicorn,
        },
        settings: {
            "import-x/resolver-next": [
                createNodeResolver(),
                createTypeScriptImportResolver(),
            ],
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
            ...importX.flatConfigs.errors.rules,
            ...eslintCommentsPlugin.configs.recommended.rules,
            ...regexpPlugin.configs.recommended.rules, // eslint-disable-line import-x/no-named-as-default-member -- to match other plugins here
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
            "sonarjs/assertions-in-tests": "off", // could be useful but yields lots of false positives (e.g. node:test isn't recognized)
            "sonarjs/deprecation": "off", // covered by @typescript-eslint/no-deprecated (and this rule crashes on .svelte files)
            "sonarjs/function-return-type": "off", // overly broad and opinionated, let typescript deal with this
            "sonarjs/no-alphabetical-sort": "off", // covered by unicorn/require-array-sort-compare
            "sonarjs/no-clear-text-protocols": "off", // covered by unicorn/prefer-https
            "sonarjs/no-commented-code": "off", // neat rule but is very very slow (over 50% of the total linting time)
            "sonarjs/no-control-regex": "off", // covered by no-control-regexp
            "sonarjs/no-empty-test-file": "off", // could be useful but it does not handle it.each or similar constructs thus yields more false positives than its worth */
            "sonarjs/no-exclusive-tests": "off", // covered by jest/no-focused-tests and mocha/no-exclusive-tests
            "sonarjs/no-redundant-optional": "off", // flags "foo?: string | undefined" as redundant even if `exactOptionalPropertyTypes` tsconfig is enabled */
            "sonarjs/no-selector-parameter": "off", // not always possible (e.g. watcher handler in vue)
            "sonarjs/no-skipped-tests": "off", // covered by jest/no-disabled-tests and mocha/no-pending-tests
            "sonarjs/no-small-switch": "off", // prefer to use small switches when the intention is to all more cases later
            "sonarjs/no-trivial-assertions": "off", // produces a bit too much noise
            "sonarjs/no-unused-vars": "off", // covered by @typescript-eslint/no-unused-vars
            "sonarjs/parameterized-tests": "off", // prefer explicit test titles over non-descript parameterized
            "sonarjs/prefer-nullish-coalescing": "off", // requires typescript and strictNullChecks, which is sane, but we also use @typescript-eslint/prefer-nullish-coalescing so this becomes redundant
            "sonarjs/prefer-regexp-exec": "off", // covered by @typescript-eslint/prefer-regexp-exec
            "sonarjs/redundant-type-aliases": "off", // "redundant" type aliases helps with self-documenting code
            "sonarjs/slow-regex": "off", // covered by regexp/no-super-linear-backtracking
            "sonarjs/super-linear-regex": "off", // covered by regexp/no-super-linear-backtracking
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

            /* enable eslint-plugin-unicorn */
            ...eslintPluginUnicorn.configs.recommended.rules,
            ...downgradeToWarning(
                eslintPluginUnicorn.configs.recommended.rules,
                [
                    "unicorn/explicit-timer-delay",
                    "unicorn/logical-assignment-operators",
                    "unicorn/max-nested-calls",
                    "unicorn/no-await-expression-member",
                    "unicorn/no-break-in-nested-loop",
                    "unicorn/no-computed-property-existence-check",
                    "unicorn/no-confusing-array-splice",
                    "unicorn/no-declarations-before-early-exit",
                    "unicorn/no-duplicate-if-branches",
                    "unicorn/no-duplicate-loops",
                    "unicorn/no-duplicate-loops",
                    "unicorn/no-incorrect-query-selector",
                    "unicorn/no-negated-array-predicate",
                    "unicorn/no-unnecessary-boolean-comparison",
                    "unicorn/no-unnecessary-splice",
                    "unicorn/no-unreadable-for-of-expression",
                    "unicorn/no-unsafe-string-replacement",
                    "unicorn/no-useless-boolean-cast",
                    "unicorn/no-useless-coercion",
                    "unicorn/no-useless-else",
                    "unicorn/no-useless-logical-operand",
                    "unicorn/no-useless-recursion",
                    "unicorn/no-useless-spread",
                    "unicorn/no-useless-template-literals",
                    "unicorn/numeric-separators-style",
                    "unicorn/operator-assignment",
                    "unicorn/prefer-array-from-map",
                    "unicorn/prefer-array-some",
                    "unicorn/prefer-at",
                    "unicorn/prefer-await",
                    "unicorn/prefer-direct-iteration",
                    "unicorn/prefer-dom-node-append",
                    "unicorn/prefer-dom-node-remove",
                    "unicorn/prefer-dom-node-replace-children",
                    "unicorn/prefer-dom-node-text-content",
                    "unicorn/prefer-early-return",
                    "unicorn/prefer-else-if",
                    "unicorn/prefer-https",
                    "unicorn/prefer-includes-over-repeated-comparisons",
                    "unicorn/prefer-iterator-helpers",
                    "unicorn/prefer-iterator-to-array",
                    "unicorn/prefer-iterator-to-array-at-end",
                    "unicorn/prefer-logical-operator-over-ternary",
                    "unicorn/prefer-math-constants",
                    "unicorn/prefer-modern-dom-apis",
                    "unicorn/prefer-number-is-safe-integer",
                    "unicorn/prefer-object-define-properties",
                    "unicorn/prefer-object-iterable-methods",
                    "unicorn/prefer-queue-microtask",
                    "unicorn/prefer-set-has",
                    "unicorn/prefer-simple-sort-comparator",
                    "unicorn/prefer-split-limit",
                    "unicorn/prefer-string-repeat",
                    "unicorn/prefer-string-replace-all",
                    "unicorn/prefer-switch",
                    "unicorn/prefer-toggle-attribute",
                    "unicorn/prefer-type-literal-last",
                    "unicorn/prefer-unicode-code-point-escapes",
                    "unicorn/require-array-join-separator",
                    "unicorn/require-array-sort-compare",
                    "unicorn/require-css-escape",
                ],
            ),
            "unicorn/catch-error-name": "off",
            "unicorn/consistent-assert": "off",
            "unicorn/consistent-boolean-name": "off",
            "unicorn/consistent-class-member-order": "off",
            "unicorn/consistent-compound-words": "off",
            "unicorn/consistent-date-clone": "off", // we prefer to use FDate instead of Date and structuredClone does not play well with jest
            "unicorn/consistent-empty-array-spread": "off",
            "unicorn/default-export-style": [
                "error",
                {
                    /* right now this rule is too restrictive with functions */
                    functions: "ignore",
                    /* classes should be default exported inline */
                    classes: "inline",
                },
            ],
            "unicorn/escape-case": "off", // typically not useful for this organization
            "unicorn/expiring-todo-comments": "off", // could be useful later
            "unicorn/explicit-length-check": [
                "error",
                { "non-zero": "greater-than" },
            ],
            "unicorn/filename-case": [
                /* enforce kebab-case in filenames */
                "error",
                {
                    case: "kebabCase",
                    checkDirectories: false,
                    ignore: [
                        "^__(fixtures|mocks|snapshots|tests)__$",
                        "^Gruntfile.js$",
                        /* ignore mocks for @forsakringskassan/apimock-express */
                        "_(get|post|put|delete).(js|cjs|mjs|ts)$",
                    ],
                },
            ],
            "unicorn/import-style": "off", // off for now
            "unicorn/name-replacements": "off", // maybe later
            "unicorn/no-abusive-eslint-disable": "off", // covered by eslint-plugin-eslint-comments
            "unicorn/no-anonymous-default-export": "off", // often used with configuration packages
            "unicorn/no-array-callback-reference": "off", // opinionated, prefer to allow passing function references to array methods (and for most part TypeScript will handle this)
            "unicorn/no-array-reduce": "off", // allow usage of reduce()
            "unicorn/no-empty-file": "off",
            "unicorn/no-immediate-mutation": "off",
            "unicorn/no-invalid-argument-count": "off", // does not respect optional parameters (e.g. jsdoc [param])
            "unicorn/no-invalid-fetch-options": "off", // let TypeScript and tests handle this
            "unicorn/no-named-default": "off", // named default is useful for Vue.js
            "unicorn/no-negated-condition": "off", // mostly agree with the rule but sometimes its useful to have the common case first even if negated
            "unicorn/no-negation-in-equality-check": "off",
            "unicorn/no-null": "off", // prefer using null over undefined
            "unicorn/no-this-outside-of-class": "off", // disagree somewhat with the rule, flags stateful objects
            "unicorn/no-top-level-assignment-in-function": "off", // would be useful, right now this gives to many errors, maybe enable later
            "unicorn/no-unnecessary-polyfills": "off",
            "unicorn/no-unreadable-array-destructuring": "off",
            "unicorn/no-useless-switch-case": "off",
            "unicorn/no-useless-undefined": "off", // opinionated, I prefer to explicitly pass undefined
            "unicorn/prefer-bigint-literals": "off",
            "unicorn/prefer-boolean-return": "off", // creates inconsistent functions when using multiple conditions
            "unicorn/prefer-dom-node-html-methods": "off", // not baseline as of 2026-07-20 (but should be enabled later)
            "unicorn/prefer-global-this": "off",
            "unicorn/prefer-hoisting-branch-code": "off", // lots of false positives with TypeScript code
            "unicorn/prefer-import-meta-properties": "error",
            "unicorn/prefer-minimal-ternary": "off", // situational, i dont think `foo[expr ? "x": "y"].bar` is more readable than `expr ? foo.x.bar : foo.y.bar`.
            "unicorn/prefer-module": "off",
            "unicorn/prefer-location-assign": "off", // jsdom does not impoement `Location.assign`
            "unicorn/prefer-optional-catch-binding": "off", // covered by sonarjs/no-ignored-exceptions
            "unicorn/prefer-promise-try": "off", // baseline but requires Node.js 23
            "unicorn/prefer-queue-microtask": [
                "warn",
                { checkSetImmediate: true, checkSetTimeout: true },
            ],
            "unicorn/prefer-scoped-selector": "off",
            "unicorn/prefer-simple-condition-first": "off", // too much noise
            "unicorn/prefer-single-call": "off",
            "unicorn/prefer-spread": "off", // for now
            "unicorn/prefer-string-raw": "off", // for now
            "unicorn/prefer-structured-clone": "off", // we use `deepClone` from `@fkui/logic` and structuredClone does not play well with jest
            "unicorn/prefer-ternary": "off",
            "unicorn/prefer-uint8array-base64": "off",
            "unicorn/relative-url-style": "warn",
            "unicorn/require-css-escape": "off", // jsdom does not implement `CSS.escape()`
            "unicorn/require-module-attributes": "off",
            "unicorn/require-module-specifiers": "off",
            "unicorn/single-line-block-comment-style": "off",
            "unicorn/switch-case-braces": "off",
            "unicorn/text-encoding-identifier-case": "error",
            ...filterRules(prettierConfig.rules, (rule) => {
                return rule.startsWith("unicorn/");
            }),

            /* Lower some errors to warnings, these are allowed on local builds (to
             * not prevent builds during development where code is unfinished and
             * might contain debugging code) but is disallowed when building from
             * Jenkins (via `--max-warnings 0`) */
            "no-console": "warn",
            "no-debugger": "warn",
            "prettier/prettier": "warn",

            "import-x/default": "off",
            "import-x/extensions": [
                "error",
                "never",
                {
                    css: "always",
                    json: "always",
                },
            ],
            "import-x/newline-after-import": "error",
            "import-x/no-absolute-path": "error",
            "import-x/no-deprecated": "error",
            "import-x/no-duplicates": "error",
            "import-x/no-dynamic-require": "error",
            "import-x/no-extraneous-dependencies": "error",
            "import-x/no-mutable-exports": "error",
            "import-x/no-named-as-default": "error",
            "import-x/no-named-as-default-member": "error",
            "import-x/no-named-default": "error",
            "import-x/no-unresolved": [
                "error",
                {
                    /* neither of the resolvers will handle @ alias */
                    ignore: ["^@"],
                },
            ],
            "import-x/no-useless-path-segments": "error",
            "import-x/order": [
                "warn",
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
            ecmaVersion: 2025,
            sourceType: "module",
        },
    }),

    defineConfig({
        /* ensure cjs and mjs files are linted too */
        name: "@forsakringskassan/eslint-config/extensions",
        files: ["**/*.cjs", "**/*.mjs"],
    }),

    defineConfig({
        /* mjs and mts requires file extension */
        name: "@forsakringskassan/eslint-config/esm",
        files: ["**/*.mjs", "**/*.mts"],
        rules: {
            "import-x/extensions": [
                "error",
                "always",
                { ignorePackages: true },
            ],
        },
    }),

    defineConfig({
        /* pageobjects and selectors are related to components and should always be PascalCase */
        name: "@forsakringskassan/eslint-config/pageobjects",
        files: ["**/*.pageobject.ts", "**/*.selectors.ts"],
        rules: {
            "unicorn/filename-case": [
                "error",
                {
                    case: "pascalCase",
                    checkDirectories: false,
                },
            ],
        },
    }),

    /* These legacy files points to compiled files which may or may not exist
     * yet */
    defineConfig({
        name: "@forsakringskassan/eslint-config/legacy-dts",
        files: ["*.d.ts", "packages/*/*.d.ts"],
        rules: {
            "import-x/no-unresolved": "off",
        },
    }),

    defineConfig({
        name: "@forsakringskassan/eslint-config/bin",
        files: ["bin/*.{js,cjs,mjs}"],
        rules: {
            /* esm requires the usage of extension in this context */
            "import-x/extensions": "off",
            /* needed to run eslint before sources are compiled to dist folder */
            "import-x/no-unresolved": "off",
        },
    }),

    /* E2E tests may import pageobjects from monorepo packages but the import
     * plugin wont resolve them, yielding lots of false positives */
    {
        name: "@forsakringskassan/eslint-config/cypress-pageobjects",
        files: ["cypress/**/*.[jt]s"],
        rules: {
            "import-x/no-extraneous-dependencies": "off",
            "import-x/order": "off",
        },
    },
];

const defaultAppConfig = defineConfig({
    name: "@forsakringskassan/eslint-config/app",
    rules: {
        "sonarjs/no-commented-code": "warn",

        /* some (bad?) patterns in FKDS forces the use of top level side-effects */
        "unicorn/no-top-level-side-effects": "off",

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
    files: [
        "**/examples/**/*.{js,ts,vue}",
        "**/src/**/{docs,tests}/**/*.{js,ts,vue}",
    ],
    rules: {
        "@eslint-community/eslint-comments/require-description": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "import-x/no-duplicates": "off",
        "import-x/no-extraneous-dependencies": "off",
        "no-console": "off",
        "no-unused-vars": "off",
        "sonarjs/no-dead-store": "off",
        "sonarjs/pseudo-random": "off",

        /* some (bad?) patterns in FKDS forces the use of top level side-effects */
        "unicorn/no-top-level-side-effects": "off",
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
