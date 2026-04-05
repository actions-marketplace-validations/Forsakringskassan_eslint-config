#!/usr/bin/env node

const { spawn } = require("node:child_process");
const path = require("node:path");

const pkgPath = path.dirname(require.resolve("eslint/package.json"));
const binary = path.join(pkgPath, "bin/eslint");

/* eslint-disable-next-line sonarjs/no-os-command-from-path -- want to run it from path */
spawn("node", [binary, ...process.argv.slice(2)], {
    stdio: "inherit",
}).on("exit", (code) => {
    process.exit(code);
});
