import { Linter } from "eslint";

export default function cliConfig(config?: Linter.Config): Linter.Config;
export default function cliConfig(
    pkg: { workspaces?: string[] },
    config?: Linter.Config,
): Linter.Config;
