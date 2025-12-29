import { test } from "@playwright/test";
import { LoginPage } from "../pages/login-page";
import { validUserName, validPassword } from "../src/test-data/users";

test("generate authenticated state", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await page.goto("/");
  await loginPage.login({ username: validUserName, password: validPassword });
  await page.context().storageState({ path: "auth.json" });
});
