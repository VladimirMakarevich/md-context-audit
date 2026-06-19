export type FindingSeverity = "error" | "warning" | "info";

export type ConfigFileName =
  | "md-context-audit.config.json"
  | "md-context-audit.config.cjs"
  | "md-context-audit.config.mjs";

export type SizeOverride = {
  pattern: string;
  maxBytes: number;
};

export type RequiredSectionRule = {
  pattern: string;
  slugs: string[];
};

export type AuditConfig = {
  include: string[];
  exclude: string[];
  size: {
    maxBytesDefault: number;
    overrides: SizeOverride[];
  };
  llm: {
    entrypoints: string[];
    maxTokensPerEntrypoint: number;
  };
  links: {
    checkExternal: boolean;
    ignorePatterns: string[];
  };
  structure: {
    orphanDocs: "error" | "warning" | "off";
    orphanExemptions: string[];
    requiredSections: RequiredSectionRule[];
  };
};

export type LoadedConfig = {
  config: AuditConfig;
  configPath?: string;
};
