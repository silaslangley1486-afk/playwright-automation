import { test, expect } from "../../fixtures/auth.fixture.js";
import { loginUrl, inventoryUrl, cartUrl } from "../../constants/url.constants";
import {
  wrongPassword,
  wrongUserName,
  lockedOutUserName,
} from "../../constants/auth.constants.js";

test("username field is visible", async ({ page, loginPage }) => {
  loginPage;
  const usernameField = page.locator('[data-test="username"]');

  await expect(usernameField).toBeVisible();
});

test("password field is visible", async ({ page, loginPage }) => {
  loginPage;
  const passwordField = page.locator('[data-test="password"]');

  await expect(passwordField).toBeVisible();
});

test("username placeholder is correct", async ({ page, loginPage }) => {
  loginPage;
  const usernameField = page.locator('[data-test="username"]');

  await expect(usernameField).toHaveAttribute("placeholder", "Username");
});

test("password placeholder is correct", async ({ page, loginPage }) => {
  loginPage;
  const passwordField = page.locator('[data-test="password"]');

  await expect(passwordField).toHaveAttribute("placeholder", "Password");
});

test("login button is visible", async ({ page, loginPage }) => {
  loginPage;
  const loginButton = page.locator('[data-test="login-button"]');

  await expect(loginButton).toBeVisible();
});

test("successful login with valid credentials", async ({
  page,
  trueUser,
  loginPage,
}) => {
  loginPage;
  await loginPage.login(trueUser);
  await expect(page).toHaveURL(inventoryUrl);
});

test("login fails with empty username", async ({
  page,
  emptyUsername,
  loginPage,
}) => {
  loginPage;
  await loginPage.login(emptyUsername);
  const errorMessage = page.locator('[data-test="error"]');

  await expect(page).toHaveURL(loginUrl);
  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toContainText(/username is required/i);
});

test("login fails with empty password", async ({
  page,
  emptyPassword,
  loginPage,
}) => {
  loginPage;
  await loginPage.login(emptyPassword);
  const errorMessage = page.locator('[data-test="error"]');

  await expect(page).toHaveURL(loginUrl);
  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toContainText(/password is required/i);
});

test("login fails with wrong password", async ({
  page,
  wrongPassword,
  loginPage,
}) => {
  loginPage;
  await loginPage.login(wrongPassword);
  const errorMessage = page.locator('[data-test="error"]');

  await expect(page).toHaveURL(loginUrl);
  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toContainText(
    /username and password do not match any user/i
  );
});

test("login fails with wrong username", async ({
  page,
  wrongUsername,
  loginPage,
}) => {
  loginPage;
  await loginPage.login(wrongUsername);
  const errorMessage = page.locator('[data-test="error"]');

  await expect(page).toHaveURL(loginUrl);
  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toContainText(
    /username and password do not match any user/i
  );
});

test("login fails with locked out user", async ({
  page,
  lockedOutUser,
  loginPage,
}) => {
  loginPage;
  await loginPage.login(lockedOutUser);
  const errorMessage = page.locator('[data-test="error"]');

  await expect(page).toHaveURL(loginUrl);
  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toContainText(/locked out/i);
});

test("cannot access inventory page without login", async ({ page }) => {
  await page.goto(inventoryUrl);
  await expect(page).toHaveURL(loginUrl);
});

test("cannot access cart page without login", async ({ page }) => {
  await page.goto(cartUrl);
  await expect(page).toHaveURL(loginUrl);
});

test("logout succeeds after successful login", async ({
  page,
  trueUser,
  loginPage,
}) => {
  loginPage;
  await loginPage.login(trueUser);
  await expect(page).toHaveURL(inventoryUrl);
  await page.locator("#react-burger-menu-btn").click();
  await page.locator('[data-test="logout-sidebar-link"]').click();
  await expect(page).toHaveURL(loginUrl);
});

test("session is preserved after navigation", async ({
  page,
  trueUser,
  loginPage,
}) => {
  loginPage;
  await loginPage.login(trueUser);
  await expect(page).toHaveURL(inventoryUrl);
  await page.goto(cartUrl);
  await expect(page).toHaveURL(cartUrl);
  await page.goto(inventoryUrl);
  await expect(page).toHaveURL(inventoryUrl);
});

test("session is preserved after page reload", async ({
  page,
  trueUser,
  loginPage,
}) => {
  loginPage;
  await loginPage.login(trueUser);
  await expect(page).toHaveURL(inventoryUrl);
  await page.reload();
  await expect(page).toHaveURL(inventoryUrl);
});
