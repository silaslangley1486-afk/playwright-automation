import { test, expect } from "../../fixtures/auth.fixture.js";
import { routes } from "../../constants/routes.js";

test.describe("Login page", () => {
  test("username field is visible", async ({ page, loginPage }) => {
    await expect(loginPage.usernameInput).toBeVisible();
  });

  test("password field is visible", async ({ page, loginPage }) => {
    await expect(loginPage.passwordInput).toBeVisible();
  });

  test("username placeholder is correct", async ({ page, loginPage }) => {
    await expect(loginPage.usernameInput).toHaveAttribute(
      "placeholder",
      "Username"
    );
  });

  test("password placeholder is correct", async ({ page, loginPage }) => {
    await expect(loginPage.passwordInput).toHaveAttribute(
      "placeholder",
      "Password"
    );
  });

  test("login button is visible", async ({ page, loginPage }) => {
    await expect(loginPage.loginButton).toBeVisible();
  });

  test("@smoke successful login with valid credentials", async ({
    page,
    validUser,
    loginPage,
  }) => {
    await loginPage.login(validUser);
    await expect(page).toHaveURL(routes.inventory);
  });

  test("login fails with empty username", async ({
    page,
    emptyUsername,
    loginPage,
  }) => {
    await loginPage.login(emptyUsername);
    await expect(page).toHaveURL(routes.login);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(/username is required/i);
  });

  test("login fails with empty password", async ({
    page,
    emptyPassword,
    loginPage,
  }) => {
    await loginPage.login(emptyPassword);
    await expect(page).toHaveURL(routes.login);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(/password is required/i);
  });

  test("login fails with wrong username", async ({
    page,
    wrongUsername,
    loginPage,
  }) => {
    await loginPage.login(wrongUsername);
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
    await loginPage.login(wrongPassword);
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
    await loginPage.login(lockedOutUser);
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

  test("session is preserved after navigation", async ({ loggedInPage }) => {
    await loggedInPage.goto(routes.inventory);
    await expect(loggedInPage).toHaveURL(routes.inventory);
    await loggedInPage.goto(routes.cart);
    await expect(loggedInPage).toHaveURL(routes.cart);
    await loggedInPage.goto(routes.inventory);
    await expect(loggedInPage).toHaveURL(routes.inventory);
  });

  test("session is preserved after page reload", async ({ loggedInPage }) => {
    await loggedInPage.goto(routes.inventory);
    await expect(loggedInPage).toHaveURL(routes.inventory);
    await loggedInPage.reload();
    await expect(loggedInPage).toHaveURL(routes.inventory);
  });
});
