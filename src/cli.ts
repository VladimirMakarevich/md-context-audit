#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const EXIT_CODE_SUCCESS = 0;
export const EXIT_CODE_RUNTIME_ERROR = 1;
export const EXIT_CODE_USAGE_ERROR = 2;

export type OutputFormat = "text" | "json";
export type FailOn = "error" | "warning" | "off";

export type ScanCommand = {
  kind: "scan";
  path: string;
  config?: string;
  format: OutputFormat;
  failOn: FailOn;
};

export type GraphCommand = {
  kind: "graph";
  path: string;
  config?: string;
  out: string;
};

export type ParsedCommand =
  | { kind: "help" }
  | { kind: "version" }
  | ScanCommand
  | GraphCommand;

export class CliUsageError extends Error {
  readonly exitCode = EXIT_CODE_USAGE_ERROR;

  constructor(message: string) {
    super(message);
    this.name = "CliUsageError";
  }
}

const HELP_TEXT = `md-context-audit

Usage:
  md-context-audit scan [path] [--config <file>] [--format text|json] [--fail-on error|warning|off]
  md-context-audit graph [path] [--config <file>] --out <file>
  md-context-audit --help
  md-context-audit --version`;

const SCAN_FORMATS = new Set<OutputFormat>(["text", "json"]);
const FAIL_ON_VALUES = new Set<FailOn>(["error", "warning", "off"]);

function isOptionToken(token: string): boolean {
  return token.startsWith("--");
}

function takeOptionValue(tokens: string[], index: number, optionName: string): string {
  const value = tokens[index + 1];

  if (value === undefined || isOptionToken(value)) {
    throw new CliUsageError(`Missing value for ${optionName}.`);
  }

  return value;
}

function parseScanCommand(tokens: string[], cwd: string): ScanCommand {
  let targetPath = cwd;
  let config: string | undefined;
  let format: OutputFormat = "text";
  let failOn: FailOn = "error";
  let pathAssigned = false;

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];

    if (!isOptionToken(token)) {
      if (pathAssigned) {
        throw new CliUsageError(`Unexpected argument: ${token}.`);
      }

      targetPath = token;
      pathAssigned = true;
      continue;
    }

    if (token === "--config") {
      config = takeOptionValue(tokens, index, "--config");
      index += 1;
      continue;
    }

    if (token === "--format") {
      const value = takeOptionValue(tokens, index, "--format");

      if (!SCAN_FORMATS.has(value as OutputFormat)) {
        throw new CliUsageError(`Invalid --format value: ${value}. Expected text or json.`);
      }

      format = value as OutputFormat;
      index += 1;
      continue;
    }

    if (token === "--fail-on") {
      const value = takeOptionValue(tokens, index, "--fail-on");

      if (!FAIL_ON_VALUES.has(value as FailOn)) {
        throw new CliUsageError(
          `Invalid --fail-on value: ${value}. Expected error, warning, or off.`
        );
      }

      failOn = value as FailOn;
      index += 1;
      continue;
    }

    throw new CliUsageError(`Unknown option for scan: ${token}.`);
  }

  return {
    kind: "scan",
    path: targetPath,
    config,
    format,
    failOn
  };
}

function parseGraphCommand(tokens: string[], cwd: string): GraphCommand {
  let targetPath = cwd;
  let config: string | undefined;
  let out: string | undefined;
  let pathAssigned = false;

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];

    if (!isOptionToken(token)) {
      if (pathAssigned) {
        throw new CliUsageError(`Unexpected argument: ${token}.`);
      }

      targetPath = token;
      pathAssigned = true;
      continue;
    }

    if (token === "--config") {
      config = takeOptionValue(tokens, index, "--config");
      index += 1;
      continue;
    }

    if (token === "--out") {
      out = takeOptionValue(tokens, index, "--out");
      index += 1;
      continue;
    }

    throw new CliUsageError(`Unknown option for graph: ${token}.`);
  }

  if (out === undefined) {
    throw new CliUsageError("Missing required option --out for graph.");
  }

  return {
    kind: "graph",
    path: targetPath,
    config,
    out
  };
}

export function parseArgv(argv: string[], cwd: string = process.cwd()): ParsedCommand {
  if (argv.length === 0) {
    throw new CliUsageError("Missing command. Use --help to see available commands.");
  }

  const [command, ...tokens] = argv;

  if (command === "--help" || command === "-h") {
    return { kind: "help" };
  }

  if (command === "--version" || command === "-v") {
    return { kind: "version" };
  }

  if (command === "scan") {
    return parseScanCommand(tokens, cwd);
  }

  if (command === "graph") {
    return parseGraphCommand(tokens, cwd);
  }

  throw new CliUsageError(`Unknown command: ${command}.`);
}

async function readPackageVersion(): Promise<string> {
  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  const packageJsonPath = path.resolve(moduleDir, "../package.json");
  const packageJsonText = await readFile(packageJsonPath, "utf8");
  const packageJson = JSON.parse(packageJsonText) as { version?: string };

  return packageJson.version ?? "0.0.0";
}

async function handleScan(command: ScanCommand): Promise<string> {
  if (command.format === "json") {
    return `${JSON.stringify(
      {
        command: "scan",
        path: command.path,
        config: command.config ?? null,
        format: command.format,
        failOn: command.failOn,
        placeholder: true
      },
      null,
      2
    )}\n`;
  }

  return `scan placeholder: path=${command.path}, format=${command.format}, fail-on=${command.failOn}\n`;
}

async function handleGraph(command: GraphCommand): Promise<string> {
  const outputPath = path.resolve(command.out);
  const outputDir = path.dirname(outputPath);

  await mkdir(outputDir, { recursive: true });
  await writeFile(
    outputPath,
    `${JSON.stringify(
      {
        root: command.path,
        nodes: [],
        edges: []
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  return `graph placeholder written to ${command.out}\n`;
}

export async function executeCommand(command: ParsedCommand): Promise<string> {
  switch (command.kind) {
    case "help":
      return `${HELP_TEXT}\n`;
    case "version":
      return `${await readPackageVersion()}\n`;
    case "scan":
      return handleScan(command);
    case "graph":
      return handleGraph(command);
    default: {
      const exhaustiveCheck: never = command;
      return exhaustiveCheck;
    }
  }
}

export async function runCli(
  argv: string[],
  io: {
    cwd?: string;
    stdout?: Pick<NodeJS.WriteStream, "write">;
    stderr?: Pick<NodeJS.WriteStream, "write">;
  } = {}
): Promise<number> {
  const stdout = io.stdout ?? process.stdout;
  const stderr = io.stderr ?? process.stderr;

  try {
    const command = parseArgv(argv, io.cwd ?? process.cwd());
    const output = await executeCommand(command);
    stdout.write(output);
    return EXIT_CODE_SUCCESS;
  } catch (error) {
    if (error instanceof CliUsageError) {
      stderr.write(`${error.message}\n`);
      return error.exitCode;
    }

    const message = error instanceof Error ? error.message : String(error);
    stderr.write(`Unexpected error: ${message}\n`);
    return EXIT_CODE_RUNTIME_ERROR;
  }
}

const invokedPath = process.argv[1];
const modulePath = fileURLToPath(import.meta.url);

if (invokedPath !== undefined && path.resolve(invokedPath) === modulePath) {
  const exitCode = await runCli(process.argv.slice(2));
  process.exitCode = exitCode;
}
