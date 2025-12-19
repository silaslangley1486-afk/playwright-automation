// tests/a11y/login.a11y.spec.ts
//import { test, expect } from "@playwright/test";
import { test, expect } from "../../fixtures/auth.fixture.js";
// import { axeFor } from "./axe";
import { routes } from "../../constants/routes";
import { expectNoSeriousA11yViolations } from "./asssertions";

test("@a11y @smoke login page has no serious a11y violations", async ({
  loginPage,
  page,
}) => {
  //await page.goto(routes.login);

  await expect(page).toHaveURL(routes.login);

  await expectNoSeriousA11yViolations(page);
});
