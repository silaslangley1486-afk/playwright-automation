import { test, expect } from "../../src/fixtures/auth.fixture";
import { routes } from "../../src/utils/routes";

test.describe("@smoke login", () => {
  test.describe.configure({ retries: 0, timeout: 25_000 });

  test("successful login with valid credentials", async ({
    page,
    validUser,
    loginPage,
  }) => {
    await loginPage.loginExpectSuccess(validUser);
    await expect(page).toHaveURL(routes.inventory);
  });
});

test.describe("@regression login", () => {
  test.describe.configure({ mode: "parallel", retries: 1, timeout: 30_000 });

  test("username field is visible", async ({ loginPage }) => {
    await expect(loginPage.usernameInput).toBeVisible();
  });

  test("password field is visible", async ({ loginPage }) => {
    await expect(loginPage.passwordInput).toBeVisible();
  });

  test("username placeholder is correct", async ({ loginPage }) => {
    await expect(loginPage.usernameInput).toHaveAttribute(
      "placeholder",
      "Username"
    );
  });

  test("password placeholder is correct", async ({ loginPage }) => {
    await expect(loginPage.passwordInput).toHaveAttribute(
      "placeholder",
      "Password"
    );
  });

  test("login button is visible", async ({ loginPage }) => {
    await expect(loginPage.loginButton).toBeVisible();
  });

  test("login fails with empty username", async ({
    page,
    emptyUsername,
    loginPage,
  }) => {
    await loginPage.submit(emptyUsername);
    await expect(page).toHaveURL(routes.login);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(/username is required/i);
  });

  test("login fails with empty password", async ({
    page,
    emptyPassword,
    loginPage,
  }) => {
    await loginPage.submit(emptyPassword);
    await expect(page).toHaveURL(routes.login);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(/password is required/i);
  });

  test("login fails with wrong username", async ({
    page,
    wrongUsername,
    loginPage,
  }) => {
    await loginPage.submit(wrongUsername);
    await expect(page).toHaveURL(routes.login);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(
      /username and password do not match any user/i
    );
  });

  test("login fails with wrong password", async ({
    page,
    wrongPassword,
    loginPage,
  }) => {
    await loginPage.submit(wrongPassword);
    await expect(page).toHaveURL(routes.login);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(
      /username and password do not match any user/i
    );
  });

  test("login fails with locked out user", async ({
    page,
    lockedOutUser,
    loginPage,
  }) => {
    await loginPage.submit(lockedOutUser);
    await expect(page).toHaveURL(routes.login);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(/locked out/i);
  });

  test("cannot access inventory page without login", async ({ page }) => {
    await page.goto(routes.inventory);
    await expect(page).toHaveURL(routes.login);
  });

  test("cannot access cart page without login", async ({ page }) => {
    await page.goto(routes.cart);
    await expect(page).toHaveURL(routes.login);
  });

  test("login persists session after navigation", async ({ loggedInPage }) => {
    await loggedInPage.goto(routes.inventory);
    await expect(loggedInPage).toHaveURL(routes.inventory);
    await loggedInPage.goto(routes.cart);
    await expect(loggedInPage).toHaveURL(routes.cart);
    await loggedInPage.goto(routes.inventory);
    await expect(loggedInPage).toHaveURL(routes.inventory);
  });

  test("login persists session across page reloads", async ({
    loggedInPage,
  }) => {
    await loggedInPage.goto(routes.inventory);
    await expect(loggedInPage).toHaveURL(routes.inventory);
    await loggedInPage.reload();
    await expect(loggedInPage).toHaveURL(routes.inventory);
  });
});
