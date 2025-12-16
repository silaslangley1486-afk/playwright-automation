import { test as base } from "@playwright/test";
import { LoginPage } from "../models/login-page";
import {
  validUserName,
  validPassword,
  wrongUserName,
  wrongPassword,
  lockedOutUserName,
} from "../test-data/users";
import type { User } from "../types/auth.types";

export type AuthFixtures = {
  inventoryUrl: string;
  cartUrl: string;
  validUser: User;
  emptyUsername: User;
  emptyPassword: User;
  wrongUsername: User;
  wrongPassword: User;
  lockedOutUser: User;
  loginPage: LoginPage;
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
});

export { expect } from "@playwright/test";
