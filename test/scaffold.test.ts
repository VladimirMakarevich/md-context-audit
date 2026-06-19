import { describe, expect, it } from "vitest";

import type { FindingSeverity } from "../src/types.js";

describe("scaffold", () => {
  it("exposes the placeholder public types module", () => {
    const severity: FindingSeverity = "info";

    expect(severity).toBe("info");
  });
});
