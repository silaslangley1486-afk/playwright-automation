import { test, expect } from "../../fixtures/auth.fixture.js";
import { expectNoSeriousA11yViolations } from "./asssertions";
import { validUserName, validPassword } from "../../test-data/users";
import {
  getActiveElementInfo,
  getActiveElementFocusStyles,
} from "./focusUtils";

test.describe("@a11y @smoke login", () => {
  test("login page has no serious a11y violations", async ({
    loginPage,
    page,
  }) => {
    await expectNoSeriousA11yViolations(page);
  });
});

test.describe("@a11y @regression login", () => {
  test("login error state is accessible", async ({ loginPage, page }) => {
    await loginPage.triggerErrorState();
    await expectNoSeriousA11yViolations(page, {
      scope: "#login_button_container",
    });

    //This test will fail since saucedemo does have a button with accessibility issues.
  });

  test("login error focus behavior (observation)", async ({
    page,
    loginPage,
  }) => {
    await loginPage.triggerErrorState();

    const active = await getActiveElementInfo(page);

    console.log("\nFocus after login error:", active);

    // Unable to test focus shifting because saucedemo doesn't provide a document that defines the intended shift focus.
    // In are real app we own, I would assert that focus moves to either the error summary, the first field, or the first invalid field
    // depending on our design guidelines.
  });

  test("login error dismiss focus behavior (observed only)", async ({
    page,
    loginPage,
  }) => {
    await loginPage.triggerErrorState();
    await loginPage.errorDismissButton.click();
    await loginPage.errorMessage.waitFor({ state: "detached" });

    const active = await getActiveElementInfo(page);

    console.log("\n[login a11y] Focus after dismissing error:", active);

    // Unable to test focus shifting because saucedemo doesn't provide a document that defines the intended shift focus.
    // In are real app we own, I would assert that focus moves to either the first field or the first invalid field
    // depending on our design guidelines.
  });

  test("keyboard-only login works", async ({ loginPage, page }) => {
    await page.keyboard.press("Tab");
    await page.keyboard.type(validUserName);
    await page.keyboard.press("Tab");
    await page.keyboard.type(validPassword);
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Login" })).toBeFocused();
    await page.keyboard.press("Enter");
    await page.getByText("Products").waitFor();
  });

  test("login button has visible focus", async ({ loginPage, page }) => {
    await page.getByRole("button", { name: "Login" }).focus();

    const active = await getActiveElementFocusStyles(page);

    console.log(active);

    console.log("Focus styles:", active?.outlineStyle, active?.outlineWidth);
    // In our own app where a focus style is defined, then I would assert here to test that the style is present and correct.
  });
});
