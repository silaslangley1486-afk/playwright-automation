import { chromium, type FullConfig, expect } from "@playwright/test";
import { LoginPage } from "./pages/login-page";
import { validUserName, validPassword } from "./src/test-data/users";

export default async function globalSetup(config: FullConfig) {
  const baseURL =
    (config.projects[0]?.use?.baseURL as string | undefined) ??
    "https://www.saucedemo.com";

  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();
  const loginPage = new LoginPage(page);

  await loginPage.navigateToLoginPage();
  await loginPage.submit({ username: validUserName, password: validPassword });
  await page.waitForURL(/inventory\.html/, { timeout: 30_000 });

  const inventoryTitle = page
    .locator('[data-test="title"]')
    .or(page.getByText("Products"));

  await expect(inventoryTitle).toBeVisible({ timeout: 30_000 });
  await context.storageState({ path: "auth.json" });
  await context.close();
  await browser.close();
}
