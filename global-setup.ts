import { chromium, firefox, webkit, FullConfig } from "@playwright/test";
import { LoginPage } from "./playwright/models/login-page";
import { validUserName, validPassword } from "./playwright/test-data/users";

const browserTypes = { chromium, firefox, webkit } as const;

export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0].use.baseURL as string | undefined;

  if (!baseURL) {
    throw new Error(
      "baseURL is not defined in playwright.config.ts (use.baseURL)"
    );
  }

  for (const project of config.projects) {
    const browserName = project.use.browserName as keyof typeof browserTypes;

    if (!browserName) continue;

    const storageStatePath = `auth.${project.name}.json`;

    const browser = await browserTypes[browserName].launch();
    const page = await browser.newPage();

    await page.goto(baseURL);

    await new LoginPage(page).login({
      username: validUserName,
      password: validPassword,
    });

    await page.context().storageState({ path: storageStatePath });
    await browser.close();
  }
}
