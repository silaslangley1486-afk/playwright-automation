import { test, expect } from "@playwright/test";

test("username field is visible", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  const usernameField = page.locator('[data-test="username"]');

  await expect(usernameField).toBeVisible();
});

test("password field is visible", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  const passwordField = page.locator('[data-test="password"]');

  await expect(passwordField).toBeVisible();
});

test("username placeholder is correct", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  const usernameField = page.locator('[data-test="username"]');

  await expect(usernameField).toHaveAttribute("placeholder", "Username");
});

test("password placeholder is correct", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  const passwordField = page.locator('[data-test="password"]');

  await expect(passwordField).toHaveAttribute("placeholder", "Password");
});

test("login button is visible", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  const loginButton = page.locator('[data-test="login-button"]');

  await expect(loginButton).toBeVisible();
});

test("successful login with valid credentials", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await page.locator('[data-test="username"]').fill("standard_user");
  await page.locator('[data-test="password"]').fill("secret_sauce");
  await page.locator('[data-test="login-button"]').click();
  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
});

test("login fails with empty username", async ({ page }) => {
  const pageUrl = "https://www.saucedemo.com/";

  await page.goto(pageUrl);
  await page.locator('[data-test="username"]').fill("");
  await page.locator('[data-test="password"]').fill("secret_sauce");
  await page.locator('[data-test="login-button"]').click();

  const errorMessage = page.locator('[data-test="error"]');

  await expect(page).toHaveURL(pageUrl);
  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toContainText(/username is required/i);
});

test("login fails with empty password", async ({ page }) => {
  const pageUrl = "https://www.saucedemo.com/";

  await page.goto(pageUrl);
  await page.locator('[data-test="username"]').fill("standard_user");
  await page.locator('[data-test="password"]').fill("");
  await page.locator('[data-test="login-button"]').click();

  const errorMessage = page.locator('[data-test="error"]');

  await expect(page).toHaveURL(pageUrl);
  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toContainText(/password is required/i);
});

test("login fails with wrong password", async ({ page }) => {
  const pageUrl = "https://www.saucedemo.com/";

  await page.goto(pageUrl);
  await page.locator('[data-test="username"]').fill("standard_user");
  await page.locator('[data-test="password"]').fill("wrong_password");
  await page.locator('[data-test="login-button"]').click();

  const errorMessage = page.locator('[data-test="error"]');

  await expect(page).toHaveURL(pageUrl);
  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toContainText(
    /username and password do not match any user/i
  );
});

test("login fails with wrong username", async ({ page }) => {
  const pageUrl = "https://www.saucedemo.com/";

  await page.goto(pageUrl);
  await page.locator('[data-test="username"]').fill("wrong_user");
  await page.locator('[data-test="password"]').fill("secret_sauce");
  await page.locator('[data-test="login-button"]').click();

  const errorMessage = page.locator('[data-test="error"]');

  await expect(page).toHaveURL(pageUrl);
  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toContainText(
    /username and password do not match any user/i
  );
});

test("login fails with locked out user", async ({ page }) => {
  const pageUrl = "https://www.saucedemo.com/";

  await page.goto(pageUrl);
  await page.fill('[data-test="username"]', "locked_out_user");
  await page.fill('[data-test="password"]', "secret_sauce");
  await page.click('[data-test="login-button"]');

  const errorMessage = page.locator('[data-test="error"]');

  await expect(page).toHaveURL(pageUrl);
  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toContainText(/locked out/i);
});

test("cannot access inventory page without login", async ({ page }) => {
  const inventoryUrl = "https://www.saucedemo.com/inventory.html";
  const loginUrl = "https://www.saucedemo.com/";

  await page.goto(inventoryUrl);
  await expect(page).toHaveURL(loginUrl);
});

test("cannot access cart page without login", async ({ page }) => {
  const cartUrl = "https://www.saucedemo.com/cart.html";
  const loginUrl = "https://www.saucedemo.com/";

  await page.goto(cartUrl);
  await expect(page).toHaveURL(loginUrl);
});

test("logout succeeds after successful login", async ({ page }) => {
  const loginUrl = "https://www.saucedemo.com/";

  await page.goto(loginUrl);
  await page.locator('[data-test="username"]').fill("standard_user");
  await page.locator('[data-test="password"]').fill("secret_sauce");
  await page.locator('[data-test="login-button"]').click();
  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
  await page.locator("#react-burger-menu-btn").click();
  await page.locator('[data-test="logout-sidebar-link"]').click();
  await expect(page).toHaveURL(loginUrl);
});

test("cannot access inventory page after logout", async ({ page }) => {
  const loginUrl = "https://www.saucedemo.com/";
  const inventoryUrl = "https://www.saucedemo.com/inventory.html";
  await page.goto(loginUrl);
  await page.locator('[data-test="username"]').fill("standard_user");
  await page.locator('[data-test="password"]').fill("secret_sauce");
  await page.locator('[data-test="login-button"]').click();
  await expect(page).toHaveURL(inventoryUrl);
  await page.locator("#react-burger-menu-btn").click();
  await page.locator('[data-test="logout-sidebar-link"]').click();
  await expect(page).toHaveURL(loginUrl);
  await page.goto(inventoryUrl);
  await expect(page).toHaveURL(loginUrl);
});

test("cannot access cart page after logout", async ({ page }) => {
  const loginUrl = "https://www.saucedemo.com/";
  const cartUrl = "https://www.saucedemo.com/cart.html";
  await page.goto(loginUrl);
  await page.locator('[data-test="username"]').fill("standard_user");
  await page.locator('[data-test="password"]').fill("secret_sauce");
  await page.locator('[data-test="login-button"]').click();
  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
  await page.locator("#react-burger-menu-btn").click();
  await page.locator('[data-test="logout-sidebar-link"]').click();
  await expect(page).toHaveURL(loginUrl);
  await page.goto(cartUrl);
  await expect(page).toHaveURL(loginUrl);
});

test("session is preserved after navigation", async ({ page }) => {
  const inventoryUrl = "https://www.saucedemo.com/inventory.html";
  const cartUrl = "https://www.saucedemo.com/cart.html";

  await page.goto("https://www.saucedemo.com/");
  await page.locator('[data-test="username"]').fill("standard_user");
  await page.locator('[data-test="password"]').fill("secret_sauce");
  await page.locator('[data-test="login-button"]').click();
  await expect(page).toHaveURL(inventoryUrl);
  await page.goto(cartUrl);
  await expect(page).toHaveURL(cartUrl);
  await page.goto(inventoryUrl);
  await expect(page).toHaveURL(inventoryUrl);
});

test("session is preserved after page reload", async ({ page }) => {
  const inventoryUrl = "https://www.saucedemo.com/inventory.html";

  await page.goto("https://www.saucedemo.com/");
  await page.locator('[data-test="username"]').fill("standard_user");
  await page.locator('[data-test="password"]').fill("secret_sauce");
  await page.locator('[data-test="login-button"]').click();
  await expect(page).toHaveURL(inventoryUrl);
  await page.reload();
  await expect(page).toHaveURL(inventoryUrl);
});
