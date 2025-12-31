import { chromium, type FullConfig, expect } from "@playwright/test";
import { LoginPage } from "./pages/login-page";
import { validUserName, validPassword } from "./src/test-data/users";

export default async function globalSetup(_config: FullConfig) {
  const browser = await chromium.launch();

  const context = await browser.newContext({
    baseURL: "https://www.saucedemo.com",
  });

  const page = await context.newPage();
  const loginPage = new LoginPage(page);

  await loginPage.navigateToLoginPage();
  await loginPage.submit({ username: validUserName, password: validPassword });

  await page.waitForURL(/inventory\.html/, { timeout: 30_000 });
  await expect(page.getByText("Products")).toBeVisible({ timeout: 30_000 });

  await context.storageState({ path: "auth.json" });
  await context.close();
  await browser.close();
}
