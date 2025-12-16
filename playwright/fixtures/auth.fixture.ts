import { test as base } from "@playwright/test";
import { LoginPage } from "../models/login-page";
import {
  trueUserName,
  truePassword,
  lockedOutUserName,
} from "../test-data/users";
import type { User } from "../types/auth.types";

export type AuthFixtures = {
  inventoryUrl: string;
  cartUrl: string;
  trueUser: User;
  lockedOutUser: User;
  loginPage: LoginPage;
};

export const test = base.extend<AuthFixtures>({
  inventoryUrl: async ({}, use) => {
    await use("https://www.saucedemo.com/inventory.html");
  },

  cartUrl: async ({}, use) => {
    await use("https://www.saucedemo.com/cart.html");
  },

  trueUser: async ({}, use) => {
    await use({
      username: trueUserName,
      password: truePassword,
    });
  },

  lockedOutUser: async ({}, use) => {
    await use({
      username: lockedOutUserName,
      password: truePassword,
    });
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateToLoginPage();
    await use(loginPage);
  },
});

export { expect } from "@playwright/test";
