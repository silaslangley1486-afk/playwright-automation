import { expect, type Page } from "@playwright/test";
import { axeFor } from "./axe";

type A11yOptions = {
  scope?: string | string[];
};

export async function expectNoSeriousOrCriticalAxeViolations(
  page: Page,
  options?: A11yOptions
): Promise<void> {
  let builder = axeFor(page);

  if (options?.scope) {
    const scopes = Array.isArray(options.scope)
      ? options.scope
      : [options.scope];

    for (const selector of scopes) {
      builder = builder.include(selector);
    }
  }

  const { violations } = await builder.analyze();

  const serious = violations.filter(
    (violation) =>
      violation.impact === "serious" || violation.impact === "critical"
  );

  if (serious.length) {
    console.log(
      "[axe] serious/critical accessibility violations:\n" +
        JSON.stringify(serious, null, 2)
    );
  }

  expect(serious).toEqual([]);
}
