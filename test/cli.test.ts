import { mkdtemp, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import {
  CliUsageError,
  EXIT_CODE_SUCCESS,
  EXIT_CODE_USAGE_ERROR,
  executeCommand,
  parseArgv,
  runCli
} from "../src/cli.js";

function createMemoryWriter() {
  let text = "";

  return {
    stream: {
      write(chunk: string) {
        text += chunk;
        return true;
      }
    },
    read() {
      return text;
    }
  };
}

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(
    tempDirs.splice(0).map(async (tempDir) => {
      const fs = await import("node:fs/promises");
      await fs.rm(tempDir, { recursive: true, force: true });
    })
  );
});

describe("parseArgv", () => {
  it("uses cwd as the default scan path", () => {
    expect(parseArgv(["scan"], "/repo")).toEqual({
      kind: "scan",
      path: "/repo",
      format: "text",
      failOn: "error"
    });
  });

  it("accepts an explicit scan path and options", () => {
    expect(
      parseArgv(
        ["scan", "docs", "--config", "config.json", "--format", "json", "--fail-on", "warning"],
        "/repo"
      )
    ).toEqual({
      kind: "scan",
      path: "docs",
      config: "config.json",
      format: "json",
      failOn: "warning"
    });
  });

  it("accepts graph options", () => {
    expect(parseArgv(["graph", "docs", "--config", "config.json", "--out", "graph.json"], "/repo")).toEqual(
      {
        kind: "graph",
        path: "docs",
        config: "config.json",
        out: "graph.json"
      }
    );
  });

  it("rejects invalid --format values", () => {
    expect(() => parseArgv(["scan", "--format", "yaml"], "/repo")).toThrowError(
      new CliUsageError("Invalid --format value: yaml. Expected text or json.")
    );
  });

  it("rejects invalid --fail-on values", () => {
    expect(() => parseArgv(["scan", "--fail-on", "fatal"], "/repo")).toThrowError(
      new CliUsageError("Invalid --fail-on value: fatal. Expected error, warning, or off.")
    );
  });

  it("requires --out for graph", () => {
    expect(() => parseArgv(["graph"], "/repo")).toThrowError(
      new CliUsageError("Missing required option --out for graph.")
    );
  });
});

describe("CLI smoke", () => {
  it("prints help", async () => {
    const stdout = createMemoryWriter();
    const stderr = createMemoryWriter();

    const exitCode = await runCli(["--help"], {
      stdout: stdout.stream,
      stderr: stderr.stream
    });

    expect(exitCode).toBe(EXIT_CODE_SUCCESS);
    expect(stdout.read()).toContain("Usage:");
    expect(stderr.read()).toBe("");
  });

  it("prints version", async () => {
    const output = await executeCommand({ kind: "version" });

    expect(output).toBe("0.0.0\n");
  });

  it("returns a usage error for an unknown command", async () => {
    const stdout = createMemoryWriter();
    const stderr = createMemoryWriter();

    const exitCode = await runCli(["unknown"], {
      stdout: stdout.stream,
      stderr: stderr.stream
    });

    expect(exitCode).toBe(EXIT_CODE_USAGE_ERROR);
    expect(stdout.read()).toBe("");
    expect(stderr.read()).toContain("Unknown command: unknown.");
  });

  it("writes the placeholder graph file", async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), "md-context-audit-"));
    tempDirs.push(tempDir);
    const outFile = path.join(tempDir, "nested", "graph.json");

    const output = await executeCommand({
      kind: "graph",
      path: "/repo",
      out: outFile
    });

    const graphJson = await readFile(outFile, "utf8");

    expect(output).toContain("graph placeholder written");
    expect(graphJson).toBe('{\n  "root": "/repo",\n  "nodes": [],\n  "edges": []\n}\n');
  });
});
