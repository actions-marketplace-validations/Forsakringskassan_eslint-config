import path from "node:path/posix";
import globals from "globals";

/**
 * @typedef {import("eslint").Linter.Config} Config
 */

/**
 * @typedef {{ workspaces?: string[] }} PackageJson
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
        "*.{js,ts,cjs,mjs,cts,mts}",
        "**/scripts/*.{js,ts,cjs,mjs,cts,mts}",
    ],
    languageOptions: {
        globals: {
            ...globals.node,
        },
    },
    rules: {
        "no-console": "off",
        "unicorn/no-top-level-side-effects": "off",
    },
});

/**
 * @param {PackageJson | undefined} pkg
 * @returns {Config}
 */
function getDefaultConfig(pkg) {
    const files = [...defaultConfig.files];
    if (pkg?.workspaces) {
        for (const workspace of pkg.workspaces) {
            files.push(path.join(workspace, files[0]));
        }
    }
    return {
        ...defaultConfig,
        files,
    };
}

/**
 * @param {Config | PackageJson} value
 * @returns {value is PackageJson}
 */
function isPkg(value) {
    if (!value) {
        return false;
    }
    /* handle imported package.json without workspaces */
    if (Object.hasOwn(value, "name") && Object.hasOwn(value, "version")) {
        return true;
    }
    /* handle handcrafted object with only workspaces set */
    if (Object.hasOwn(value, "workspaces")) {
        return true;
    }
    return false;
}

/**
 * @param {[config?: Config] | [pkg: PackageJson, config?: Config]} [params]
 * @returns {[pkg: PackageJson | undefined, config: Config | undefined]}
 */
function unpackArgs(params) {
    if (params.length >= 2) {
        return params;
    }
    if (params.length === 0) {
        return [undefined, undefined];
    }
    const param = params[0];
    if (isPkg(param)) {
        return [param, undefined];
    }
    return [undefined, param];
}

/**
 * @param {[config: Config] | [pkg: PackageJson, config?: Config]} [params]
 * @returns {Config}
 */
export default function cliConfig(...params) {
    const [pkg, override] = unpackArgs(params);
    return merge(getDefaultConfig(pkg), override ?? {});
}
