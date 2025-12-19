import { test } from "../../fixtures/auth.fixture.js";
import { expectNoSeriousA11yViolations } from "./asssertions.js";

test("@smoke @a11y inventory page after login", async ({
  loginPage,
  page,
  validUser,
}) => {
  await loginPage.login(validUser);
  await page.getByText("Products").waitFor();
  await expectNoSeriousA11yViolations(page);
});
