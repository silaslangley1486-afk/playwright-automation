import { test as base } from "@playwright/test";
import { LoginPage } from "../models/login-page";
import {
  trueUserName,
  truePassword,
  wrongUserName,
  wrongPassword,
  lockedOutUserName,
} from "../test-data/users";
import type { User } from "../types/auth.types";

export type AuthFixtures = {
  inventoryUrl: string;
  cartUrl: string;
  trueUser: User;
  emptyUsername: User;
  emptyPassword: User;
  wrongUsername: User;
  wrongPassword: User;
  lockedOutUser: User;
  loginPage: LoginPage;
};

export const test = base.extend<AuthFixtures>({
  trueUser: async ({}, use) => {
    await use({
      username: trueUserName,
      password: truePassword,
    });
  },

  emptyUsername: async ({}, use) => {
    await use({
      username: "",
      password: truePassword,
    });
  },

  emptyPassword: async ({}, use) => {
    await use({
      username: trueUserName,
      password: "",
    });
  },

  wrongUsername: async ({}, use) => {
    await use({
      username: wrongUserName,
      password: truePassword,
    });
  },

  wrongPassword: async ({}, use) => {
    await use({
      username: trueUserName,
      password: wrongPassword,
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
