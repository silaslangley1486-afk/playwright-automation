import { Page, Locator } from "@playwright/test";
import { routes } from "../constants/routes";
import type { User } from "../types/auth.types";

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly burgerMenuButton: Locator;
  readonly logoutSidebarLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.burgerMenuButton = page.locator("#react-burger-menu-btn");
    this.logoutSidebarLink = page.locator('[data-test="logout-sidebar-link"]');
  }

  async navigateToLoginPage(): Promise<void> {
    await this.page.goto(routes.login);
  }

  async login(user: User): Promise<void> {
    await this.usernameInput.fill(user.username);
    await this.passwordInput.fill(user.password);
    await this.loginButton.click();
  }
}
