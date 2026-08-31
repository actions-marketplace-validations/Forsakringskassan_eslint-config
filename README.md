# `eslint-config-fk`

> Försäkringskassan ESLint [shareable](http://eslint.org/docs/developer-guide/shareable-configs.html) konfiguration

## Installation

```
npm install --save-dev @forsakringskassan/eslint-config
```

## Innehåll

Detta NPM paket innehåller en grundkonfiguration för ESLint anpassad för FK.

Vissa regler är konfigurerade som varningar och släpps igenom i lokala byggen.
Byggjobb som körs från CI/CD släpper inte igenom varningar.

För att använda ska din `package.json` innehålla två script:

```json
{
    "scripts": {
        "eslint": "eslint --cache .",
        "eslint:fix": "eslint --fix ."
    }
}
```

Kataloger och filer som ska ignoreras läggs in i `.eslintignore` eller med `excludedFiles` i `overrides`.

## Användande

`@forsakringskassan/eslint-config` inkluderar `eslint` så din applikation behöver inte själv hålla ett eget beroende mot `eslint`, om du har ett sen tidigare kan du med fördel ta bort det.

I din `eslint.config.mjs`:

```ts
import defaultConfig from "@forsakringskassan/eslint-config";
import cliConfig from "@forsakringskassan/eslint-config-cli";
import cypressConfig from "@forsakringskassan/eslint-config-cypress";
import jestConfig from "@forsakringskassan/eslint-config-jest";
import svelteConfig from "@forsakringskassan/eslint-config-svelte";
import typescriptConfig from "@forsakringskassan/eslint-config-typescript";
import typeinfoConfig from "@forsakringskassan/eslint-config-typescript-typeinfo";
import vueConfig from "@forsakringskassan/eslint-config-vue";
import pkg from "./package.json" with { type: "json" };

export default [
    {
        name: "Ignored files",
        ignores: [
            "**/coverage/**",
            "**/dist/**",
            "**/node_modules/**",
            "**/public/**",
            "**/temp/**",
            "**/typedoc/**",
        ],
    },

    ...defaultConfig,

    cliConfig(pkg),
    typescriptConfig(),
    typeinfoConfig(import.meta.dirname),
    vueConfig(),
    jestConfig(),
    cypressConfig(),
    svelteConfig(),
];
```

Konfigurationsfabriker tar ett optional object för att anpassa filer som ska matchas:

```ts
export default [
    typescriptConfig({
        files: ["..."],
    }),
];
```

Behöver man skriva över regler använder man ett nytt block under fabriker:

```ts
import { defineConfig } from "@forsakringskassan/eslint-config";

export default [
    defineConfig({
        name: "local",
        rules: {/* ... */},
    }),
];
```

`@forsakringskassan/eslint-config` reexports [`globals`][npm:globals], if you need to overwrite global variables for a set of files:

[npm:globals]: https://www.npmjs.com/package/globals

```ts
import defaultConfig, { globals } from "@forsakringskassan/eslint-config";

export default [
    ...defaultConfig,

    {
        name: "local/browser",
        files: ["src/browser/**/*.{js,ts}"],
        languageOptions: {
            globals: { ...globals.browser },
        },
    },
];
```

`@forsakringskassan/eslint-config` exports some additional specialized configurations:

```ts
import {
    appConfig,
    docsConfig,
    examplesConfig,
    sandboxConfig,
} from "@forsakringskassan/eslint-config";
```

- `appConfig` includes overrides for end user applications.
- `docsConfig` includes overrides for a documentation site (default in the `docs` folder).
- `examplesConfig` includes overrides for documentation examples.
- `sandboxConfig` includes overrides for sandbox applications.

`appConfig` is to be used with end user application and the others are typically used in a monorepo component library such as [`forsakringskassan/designsystem`](https://github.com/Forsakringskassan/designsystem/tree/main).

## Github action

To use with Github actions:

```yml
steps:
    - uses: actions/checkout@v5
    - name: Use Node.js
      uses: actions/setup-node@v6
    - name: Install dependencies
      run: npm ci
    - name: ESLint
      uses: Forsakringskassan/eslint-config@main
```

`main` can also be replaced by a semantic versioned tag such as `v13.0.0`:

```diff
-uses: Forsakringskassan/eslint-config@main
+uses: Forsakringskassan/eslint-config@v13.0.0
```

This is recommended when using a tool such as Renovate to manage dependencies.

> [!IMPORTANT]
> You need to have `@forsakringskassan/eslint-config` installed as a dependency in `package.json`.
> This ensures you have control over which version of the tool is actually running.
>
> If you are using a tag for version make sure it matches the version in `package.json`.
