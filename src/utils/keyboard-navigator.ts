import type { Page } from "@playwright/test";

export class KeyboardNavigator {
  constructor(private readonly page: Page) {}

  async tab(steps = 1) {
    for (let i = 0; i < steps; i++) {
      await this.page.keyboard.press("Tab");
    }
  }

  async enter() {
    await this.page.keyboard.press("Enter");
  }
}
