import { test } from "../../fixtures/auth.fixture.js";
import { expectNoSeriousA11yViolations } from "./asssertions";

test("@a11y @smoke login page has no serious a11y violations", async ({
  loginPage,
  page,
}) => {
  await expectNoSeriousA11yViolations(page);
});
