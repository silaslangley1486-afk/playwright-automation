import { test } from "@playwright/test";

/**
 * Marks the current test as an expected failure for a known accessibility issue.
 * The test still runs and reports results, but does not fail the suite.
 */
export function expectKnownA11yFailure(reason: string): void {
  test.fail(true, reason);
}
