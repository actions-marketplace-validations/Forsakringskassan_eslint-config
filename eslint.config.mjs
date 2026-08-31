import defaultConfig from "./packages/eslint-config/index.mjs";
import cliConfig from "./packages/eslint-config-cli/index.mjs";
import cypressConfig from "./packages/eslint-config-cypress/index.mjs";
import jestConfig from "./packages/eslint-config-jest/index.mjs";
import svelteConfig from "./packages/eslint-config-svelte/index.mjs";
import typescriptConfig from "./packages/eslint-config-typescript/index.mjs";
import typeinfoConfig from "./packages/eslint-config-typescript-typeinfo/index.mjs";
import vitestConfig from "./packages/eslint-config-vitest/index.mjs";
import vueConfig from "./packages/eslint-config-vue/index.mjs";

export default [
    {
        name: "Ignored files",
        ignores: [
            "**/coverage/**",
            "**/dist/**",
            "**/node_modules/**",
            "**/temp/**",
        ],
    },

    ...defaultConfig,

    cliConfig({
        files: ["packages/eslint-config-cli/example.js"],
    }),
    typescriptConfig(),
    typeinfoConfig(import.meta.dirname, {
        files: ["packages/**/*.{ts,vue}"],
        ignores: ["**/*.d.ts", "**/*.cy.ts", "**/*.spec.ts"],
    }),
    vueConfig(),
    jestConfig({
        files: ["packages/eslint-config-jest/**/*.spec.[jt]s"],
    }),
    vitestConfig({
        files: ["packages/eslint-config-vitest/**/*.spec.[jt]s"],
    }),
    cypressConfig(),
    svelteConfig(),

    {
        name: "local",
        rules: {
            /* cannot be tester easily in examples (as the files doesn't exist) */
            "import-x/no-unresolved": "off",
        },
    },
];
