import type { Page } from "@playwright/test";

export class KeyboardNavigator {
  constructor(private readonly page: Page) {}

  async enter() {
    await this.page.keyboard.press("Enter");
  }
}
