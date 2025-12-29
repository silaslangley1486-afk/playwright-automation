import { test as base, expect, Page, BrowserContext } from "@playwright/test";
import { LoginPage } from "../../pages/login-page";
import { InventoryPage } from "../../pages/inventory-page";
import {
  validUserName,
  validPassword,
  wrongUserName,
  wrongPassword,
  lockedOutUserName,
} from "../test-data/users";
import type { User } from "../types/auth.types";

export type AuthFixtures = {
  validUser: User;
  emptyUsername: User;
  emptyPassword: User;
  wrongUsername: User;
  wrongPassword: User;
  lockedOutUser: User;

  loginPage: LoginPage; // unauthenticated login POM
  loggedInPage: Page; // authenticated page (UI login per test)
  loginModel: LoginPage; // LoginPage bound to loggedInPage
  inventoryPage: InventoryPage; // assuming you have this
};

export const test = base.extend<AuthFixtures>({
  validUser: async ({}, use) => {
    await use({
      username: validUserName,
      password: validPassword,
    });
  },

  emptyUsername: async ({}, use) => {
    await use({
      username: "",
      password: validPassword,
    });
  },

  emptyPassword: async ({}, use) => {
    await use({
      username: validUserName,
      password: "",
    });
  },

  wrongUsername: async ({}, use) => {
    await use({
      username: wrongUserName,
      password: validPassword,
    });
  },

  wrongPassword: async ({}, use) => {
    await use({
      username: validUserName,
      password: wrongPassword,
    });
  },

  lockedOutUser: async ({}, use) => {
    await use({
      username: lockedOutUserName,
      password: validPassword,
    });
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    await use(loginPage);
  },

  loggedInPage: async ({ browser }, use) => {
    const context: BrowserContext = await browser.newContext();
    const page: Page = await context.newPage();

    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    await loginPage.login({
      username: validUserName,
      password: validPassword,
    });

    await use(page);
    await context.close();
  },

  loginModel: async ({ loggedInPage }, use) => {
    await use(new LoginPage(loggedInPage));
  },

  inventoryPage: async ({ loggedInPage }, use) => {
    await use(new InventoryPage(loggedInPage));
  },
});

export { expect } from "@playwright/test";
