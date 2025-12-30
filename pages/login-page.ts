import { Page, Locator } from "@playwright/test";
import { routes } from "../src/utils/routes";
import type { User } from "../src/types/auth.types";
import { wrongPassword, lockedOutUserName } from "../src/test-data/users";
import { KeyboardNavigator } from "../src/utils/keyboard-navigator";

export class LoginPage {
  readonly page: Page;
  readonly keyboardNavigator: KeyboardNavigator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly burgerMenuButton: Locator;
  readonly logoutSidebarLink: Locator;
  readonly errorDismissButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.keyboardNavigator = new KeyboardNavigator(page);
    this.usernameInput = page
      .getByLabel("Username")
      .or(page.getByPlaceholder("Username"))
      .or(page.locator('[data-test="username"]'));

    this.passwordInput = page
      .getByLabel("Password")
      .or(page.getByPlaceholder("Password"))
      .or(page.locator('[data-test="password"]'));

    this.loginButton = page
      .getByRole("button", { name: "Login" })
      .or(page.locator('[data-test="login-button"]'));

    this.errorMessage = page.locator('[data-test="error"]');
    this.errorDismissButton = page.locator('[data-test="error-button"]');
    this.burgerMenuButton = page.locator("#react-burger-menu-btn");
    this.logoutSidebarLink = page.locator('[data-test="logout-sidebar-link"]');
  }

  async navigateToLoginPage(): Promise<void> {
    await this.page.goto(routes.login);
  }

  async submit(user: User): Promise<void> {
    await this.usernameInput.fill(user.username);
    await this.passwordInput.fill(user.password);
    await this.loginButton.click();
  }

  async loginExpectSuccess(user: User): Promise<void> {
    await this.submit(user);
    await this.page.waitForURL(/inventory\.html/);
  }

  async triggerErrorState() {
    await this.navigateToLoginPage();
    await this.usernameInput.fill(lockedOutUserName);
    await this.passwordInput.fill(wrongPassword);
    await this.loginButton.click();
    await this.errorMessage.waitFor();
  }

  async typeUsername(value: string) {
    await this.usernameInput.pressSequentially(value);
  }

  async typePassword(value: string) {
    await this.passwordInput.pressSequentially(value);
  }
}
