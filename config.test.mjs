import test from "node:test";
import globals from "globals";
import { minimatch } from "minimatch";
import defaultConfig from "./packages/eslint-config/index.mjs";
import cypressConfig from "./packages/eslint-config-cypress/index.mjs";
import jestConfig from "./packages/eslint-config-jest/index.mjs";
import svelteConfig from "./packages/eslint-config-svelte/index.mjs";
import typescriptConfig from "./packages/eslint-config-typescript/index.mjs";
import typeinfoConfig from "./packages/eslint-config-typescript-typeinfo/index.mjs";
import vitestConfig from "./packages/eslint-config-vitest/index.mjs";
import vueConfig from "./packages/eslint-config-vue/index.mjs";

/**
 * @typedef {import("eslint").Linter.Config} Config
 */

const browserGlobals = new Set(Object.keys(globals.browser));
const nodeGlobals = new Set(Object.keys(globals.node));

function needSorting(parent) {
    return ["rules", "globals"].includes(parent);
}

function cmp([a], [b]) {
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
}

/**
 * @param {unknown} value
 * @returns {unknown}
 */
function serialize(value, parent) {
    if (typeof value === "function") {
        return `[Function ${value.name}]`;
    }
    if (Array.isArray(value)) {
        return value.map((it) => serialize(it));
    }
    if (value && typeof value === "object") {
        const entries = Object.entries(value);
        const mapped = entries.map(([key, it]) => {
            key = key.replace(process.cwd(), "<rootDir>");
            if (typeof it === "string") {
                it = it.replace(process.cwd(), "<rootDir>");
            }
            if (key === "plugins") {
                const pluginEntries = Object.entries(it);
                const pluginMapped = pluginEntries.map(([key, jt]) => {
                    return [key, `[Plugin ${jt.meta?.name ?? key}]`];
                });
                return [key, Object.fromEntries(pluginMapped)];
            }
            if (key === "parser") {
                return [key, `[Parser ${it.meta?.name ?? key}]`];
            }
            if (key === "version") {
                return [key, it.replace(/^(\d+)\.(\d+)\.(\d+)$/, "$1.x.x")];
            }
            if (key === "globals") {
                const set = new Set(Object.keys(value.globals));
                let remainder = new Set(set);
                const subsets = [];
                if (nodeGlobals.isSubsetOf(set)) {
                    subsets.push("globals.node");
                    remainder = remainder.difference(nodeGlobals);
                }
                if (browserGlobals.isSubsetOf(set)) {
                    subsets.push("globals.browser");
                    remainder = remainder.difference(browserGlobals);
                }
                const values = [
                    ...subsets.map((it) => `...${it}`),
                    ...Array.from(remainder, (it) => `"${it}`),
                ];
                return [key, values];
            }
            return [key.replace(/\\/g, "/"), serialize(it, key)];
        });
        const sorted = needSorting(parent) ? mapped.toSorted(cmp) : mapped;
        return Object.fromEntries(sorted);
    }
    return value;
}

const packages = [
    "@forsakringskassan/eslint-config",
    "@forsakringskassan/eslint-config-angular",
    "@forsakringskassan/eslint-config-cli",
    "@forsakringskassan/eslint-config-cypress",
    "@forsakringskassan/eslint-config-jest",
    "@forsakringskassan/eslint-config-svelte",
    "@forsakringskassan/eslint-config-typescript",
    "@forsakringskassan/eslint-config-typescript-typeinfo",
    "@forsakringskassan/eslint-config-vue",
    "@forsakringskassan/eslint-config-vitest",
];

for (const pkg of packages) {
    test(`Package ${pkg}`, async (t) => {
        const { default: factory } = await import(`${pkg}/index.mjs`);
        const config = typeof factory === "function" ? factory() : factory;
        t.assert.snapshot(serialize(config));
    });
}

const config = [
    ...defaultConfig,
    typescriptConfig(),
    typeinfoConfig(import.meta.dirname),
    vueConfig(),
    jestConfig({ files: ["**/*.jest.ts"] }),
    vitestConfig({ files: ["**/*.vitest.ts"] }),
    cypressConfig(),
    svelteConfig(),
];

/**
 * @param {string} filePath
 * @returns {Config[]}
 */
function matchConfig(filePath) {
    return config.filter((it) => {
        const { files = [] } = it;
        return (
            files.length === 0 || files.some((jt) => minimatch(filePath, jt))
        );
    });
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

const extensions = {
    ".js": "src/index.js",
    ".ts": "src/index.ts",
    ".cy.ts": "src/foo.cy.ts",
    ".spec.ts (jest)": "src/foo.jest.ts",
    ".spec.ts (vitest)": "src/foo.vitest.ts",
    ".vue": "src/Foo.vue",
    ".svelte": "src/Foo.svelte",
};

for (const [key, filePath] of Object.entries(extensions)) {
    test(`Extension ${key}`, async (t) => {
        const effectiveConfig = matchConfig(filePath).reduce(merge, {});
        delete effectiveConfig.name;
        delete effectiveConfig.files;
        delete effectiveConfig.ignores;
        t.assert.snapshot(serialize(effectiveConfig));
    });
}
