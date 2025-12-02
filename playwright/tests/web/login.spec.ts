// has username field is visible
// password field is visible

// fill username with valid value
// fill password with valid value
// click login button
// check if successfully goes to the inventory page

// fill username with empty value
// fill password with true password
// click login button
// check if doesn't go to inventory page
// check if error message is visible for username

// fill username with true username
// fill password with empty value
// click login button
// check if doesn't go to inventory page
// check if error message is visible for password

// fill username with true username
// fill password with wrong value
// click login button
// check if doesn't go to inventory page
// check if error message is visible for wrong credentials

// fill username with wrong value
// fill password with true password
// click login button
// check if doesn't go to inventory page
// check if correct error message is visible for wrong credentials

// fill username with locked out user
// fill password with true password
// click login button
// check if doesn't go to inventory page
// check if correct error message is visible for locked out user

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
