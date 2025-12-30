import { test, expect } from "../../src/fixtures/auth.fixture.js";
import { expectKnownA11yFailure } from "../../src/utils/a11y/known-failures";
import { expectNoSeriousOrCriticalAxeViolations } from "../../src/utils/a11y/assertions.js";
import { tabUntil } from "../../src/utils/a11y/tab-until.js";
import { validUserName, validPassword } from "../../src/test-data/users";
import {
  getActiveElementInfo,
  getActiveElementFocusStyles,
} from "../../src/utils/a11y/focus-utils.js";
import type { ActiveElementInfo } from "../../src/utils/a11y/focus-utils";

const isUsernameInputFocused = (info: ActiveElementInfo | null) =>
  info?.tag === "INPUT" && /^user-name$/i.test(info.id);

const isPasswordInputFocused = (info: ActiveElementInfo | null) =>
  info?.tag === "INPUT" && /^password$/i.test(info.id);

const isLoginButtonFocused = (info: ActiveElementInfo | null) =>
  (info?.tag === "INPUT" || info?.tag === "BUTTON") &&
  info.id === "login-button";

test.describe("@a11y @smoke login", () => {
  test("login page has no serious a11y violations", async ({ page }) => {
    expectKnownA11yFailure(
      "SauceDemo login page contains known accessibility violations"
    );

    await expectNoSeriousOrCriticalAxeViolations(page);
  });
});

test.describe("@a11y @regression login", () => {
  test("login error state is accessible", async ({ loginPage, page }) => {
    expectKnownA11yFailure(
      "SauceDemo login page login button contains known accessibility violations"
    );

    await loginPage.triggerErrorState();
    await expectNoSeriousOrCriticalAxeViolations(page, {
      scope: "#login_button_container",
    });
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

  test("keyboard-only login works", async ({ loginPage, inventoryPage }) => {
    await tabUntil(loginPage.page, isUsernameInputFocused, {
      debugLabel: "tab until username input",
    });
    await expect(loginPage.usernameInput).toBeFocused();
    await loginPage.typeUsername(validUserName);

    await tabUntil(loginPage.page, isPasswordInputFocused, {
      debugLabel: "tab until password input",
    });
    await expect(loginPage.passwordInput).toBeFocused();
    await loginPage.typePassword(validPassword);

    await tabUntil(loginPage.page, isLoginButtonFocused, {
      debugLabel: "tab until login button",
    });
    await expect(loginPage.loginButton).toBeFocused();
    await loginPage.keyboardNavigator.enter();
    await expect(inventoryPage.title).toBeVisible();
  });

  test("login button has visible focus", async ({ loginPage }) => {
    await loginPage.loginButton.focus();

    const active = await getActiveElementFocusStyles(loginPage.page);

    console.log(active);

    console.log("Focus styles:", active?.outlineStyle, active?.outlineWidth);
    // In our own app where a focus style is defined, then I would assert here to test that the style is present and correct.
  });
});
