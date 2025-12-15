import { test as base } from "@playwright/test";

export type AuthFixtures = {
  loginUrl: string;
  inventoryUrl: string;
  cartUrl: string;
  user: { username: string; password: string };
  login: () => Promise<void>;
};

export const test = base.extend<AuthFixtures>({
  loginUrl: async ({}, use) => {
    await use("https://www.saucedemo.com/");
  },

  inventoryUrl: async ({}, use) => {
    await use("https://www.saucedemo.com/inventory.html");
  },

  cartUrl: async ({}, use) => {
    await use("https://www.saucedemo.com/cart.html");
  },

  user: async ({}, use) => {
    await use({
      username: "standard_user",
      password: "secret_sauce",
    });
  },

  login: async ({ page, loginUrl, inventoryUrl, user }, use) => {
    await use(async () => {
      await page.goto(loginUrl);
      await page.locator('[data-test="username"]').fill(user.username);
      await page.locator('[data-test="password"]').fill(user.password);
      await page.locator('[data-test="login-button"]').click();
      await page.waitForURL(inventoryUrl);
    });
  },
});

export { expect } from "@playwright/test";
