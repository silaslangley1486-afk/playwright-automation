// tests/a11y/login.a11y.spec.ts
import { test, expect } from "@playwright/test";
import { axeFor } from "./axe";
import { routes } from "../../constants/routes.js";

test("@a11y @smoke login page has no serious violations", async ({ page }) => {
  await page.goto(routes.login);

  const { violations } = await axeFor(page).analyze();

  const serious = violations.filter(
    (violation) =>
      violation.impact === "serious" || violation.impact === "critical"
  );

  console.log(
    "All axe violations on login page:\n",
    JSON.stringify(violations, null, 2)
  );

  if (serious.length) {
    console.log(JSON.stringify(serious, null, 2));
  }

  expect(serious).toEqual([]);
});
