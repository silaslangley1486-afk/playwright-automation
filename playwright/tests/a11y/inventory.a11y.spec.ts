import { test } from "../../fixtures/auth.fixture.js";
import { expectNoSeriousA11yViolations } from "./asssertions.js";
// import { axeFor } from "./axe"; // your AxeBuilder helper

test("@smoke @a11y inventory page after login", async ({
  loginPage,
  page,
  validUser,
}) => {
  await loginPage.login(validUser);
  await page.getByText("Products").waitFor();
  await expectNoSeriousA11yViolations(page);

  //   const { violations } = await axeFor(page).analyze();

  //   const serious = violations.filter(
  //     (violation) =>
  //       violation.impact === "serious" || violation.impact === "critical"
  //   );

  //   if (serious.length) {
  //     console.log(JSON.stringify(serious, null, 2));
  //   }

  //   expect(serious).toEqual([]);
});
