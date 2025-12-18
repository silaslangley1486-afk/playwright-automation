import { test as base, expect, Page, BrowserContext } from "@playwright/test";
import { LoginPage } from "../models/login-page";
import { InventoryPage } from "../models/inventory-page";
import {
  validUserName,
  validPassword,
  wrongUserName,
  wrongPassword,
  lockedOutUserName,
} from "../test-data/users";
import type { User } from "../types/auth.types";

export type AuthFixtures = {
  validUser: User;
  emptyUsername: User;
  emptyPassword: User;
  wrongUsername: User;
  wrongPassword: User;
  lockedOutUser: User;

  loginPage: LoginPage; // unauthenticated login POM
  loggedInPage: Page; // authenticated page (UI login per test)
  loginModel: LoginPage; // LoginPage bound to loggedInPage
  inventoryPage: InventoryPage; // assuming you have this
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

  loggedInPage: async ({ browser }, use) => {
    const context: BrowserContext = await browser.newContext();
    const page: Page = await context.newPage();

    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    await loginPage.login({
      username: validUserName,
      password: validPassword,
    });

    await use(page);
    await context.close();
  },

  loginModel: async ({ loggedInPage }, use) => {
    await use(new LoginPage(loggedInPage));
  },

  inventoryPage: async ({ loggedInPage }, use) => {
    await use(new InventoryPage(loggedInPage));
  },
});

export { expect } from "@playwright/test";

// import { test as base, expect, Page, BrowserContext } from "@playwright/test";
// import * as fs from "fs";
// import * as path from "path";

// import { LoginPage } from "../models/login-page";
// import { InventoryPage } from "../models/inventory-page";

// import {
//   validUserName,
//   validPassword,
//   wrongUserName,
//   wrongPassword,
//   lockedOutUserName,
// } from "../test-data/users";

// import type { User } from "../types/auth.types";

// export type AuthFixtures = {
//   validUser: User;
//   emptyUsername: User;
//   emptyPassword: User;
//   wrongUsername: User;
//   wrongPassword: User;
//   lockedOutUser: User;

//   loginPage: LoginPage;
//   loggedInPage: Page;
//   loginModel: LoginPage;
//   inventoryPage: InventoryPage;
// };

// export const test = base.extend<AuthFixtures>({
//   validUser: async ({}, use) => {
//     await use({
//       username: validUserName,
//       password: validPassword,
//     });
//   },

//   emptyUsername: async ({}, use) => {
//     await use({
//       username: "",
//       password: validPassword,
//     });
//   },

//   emptyPassword: async ({}, use) => {
//     await use({
//       username: validUserName,
//       password: "",
//     });
//   },

//   wrongUsername: async ({}, use) => {
//     await use({
//       username: wrongUserName,
//       password: validPassword,
//     });
//   },

//   wrongPassword: async ({}, use) => {
//     await use({
//       username: validUserName,
//       password: wrongPassword,
//     });
//   },

//   lockedOutUser: async ({}, use) => {
//     await use({
//       username: lockedOutUserName,
//       password: validPassword,
//     });
//   },

//   // For tests that explicitly exercise the login UI
//   loginPage: async ({ page }, use) => {
//     const loginPage = new LoginPage(page);
//     await loginPage.navigateToLoginPage();
//     await use(loginPage);
//   },

//   // For tests that need an authenticated user, but are not testing login itself.
//   loggedInPage: async ({ browser }, use, testInfo) => {
//     const storageStatePath = path.join(
//       process.cwd(),
//       `auth.${testInfo.project.name}.json`
//     );

//     let context: BrowserContext;

//     if (fs.existsSync(storageStatePath)) {
//       context = await browser.newContext({ storageState: storageStatePath });
//     } else {
//       context = await browser.newContext();
//       const setupPage = await context.newPage();

//       const loginPage = new LoginPage(setupPage);
//       await loginPage.navigateToLoginPage();
//       await loginPage.login({
//         username: validUserName,
//         password: validPassword,
//       });

//       await context.storageState({ path: storageStatePath });
//     }

//     const page = await context.newPage();
//     await use(page);
//     await context.close();
//   },

//   loginModel: async ({ loggedInPage }, use) => {
//     await use(new LoginPage(loggedInPage));
//   },

//   inventoryPage: async ({ loggedInPage }, use) => {
//     await use(new InventoryPage(loggedInPage));
//   },
// });

// export { expect };

// import { test as base, Page } from "@playwright/test";
// import { LoginPage } from "../models/login-page";
// import { InventoryPage } from "../models/inventory-page";
// import {
//   validUserName,
//   validPassword,
//   wrongUserName,
//   wrongPassword,
//   lockedOutUserName,
// } from "../test-data/users";
// import type { User } from "../types/auth.types";

// export type AuthFixtures = {
//   validUser: User;
//   emptyUsername: User;
//   emptyPassword: User;
//   wrongUsername: User;
//   wrongPassword: User;
//   lockedOutUser: User;

//   // Unauthenticated login-page model (navigates to login)
//   loginPage: LoginPage;

//   // Authenticated page (uses storageState)
//   loggedInPage: Page;

//   // LoginPage model bound to loggedInPage (no navigation)
//   loginModel: LoginPage;

//   inventoryPage: InventoryPage;
// };

// export const test = base.extend<AuthFixtures>({
//   validUser: async ({}, use) => {
//     await use({
//       username: validUserName,
//       password: validPassword,
//     });
//   },

//   emptyUsername: async ({}, use) => {
//     await use({
//       username: "",
//       password: validPassword,
//     });
//   },

//   emptyPassword: async ({}, use) => {
//     await use({
//       username: validUserName,
//       password: "",
//     });
//   },

//   wrongUsername: async ({}, use) => {
//     await use({
//       username: wrongUserName,
//       password: validPassword,
//     });
//   },

//   wrongPassword: async ({}, use) => {
//     await use({
//       username: validUserName,
//       password: wrongPassword,
//     });
//   },

//   lockedOutUser: async ({}, use) => {
//     await use({
//       username: lockedOutUserName,
//       password: validPassword,
//     });
//   },

//   loginPage: async ({ page }, use) => {
//     const loginPage = new LoginPage(page);
//     await loginPage.navigateToLoginPage();
//     await use(loginPage);
//   },

//   loggedInPage: async ({ browser }, use, testInfo) => {
//     const storageStatePath = `auth.${testInfo.project.name}.json`;

//     const context = await browser.newContext({
//       storageState: storageStatePath,
//     });

//     const page = await context.newPage();
//     await use(page);
//     await context.close();
//   },

//   loginModel: async ({ loggedInPage }, use) => {
//     // Same selectors as LoginPage uses everywhere else:
//     await use(new LoginPage(loggedInPage));
//   },

//   inventoryPage: async ({ loggedInPage }, use) => {
//     await use(new InventoryPage(loggedInPage));
//   },
// });

// export { expect } from "@playwright/test";

// import { test as base, Page } from "@playwright/test";
// import { LoginPage } from "../models/login-page";
// import {
//   validUserName,
//   validPassword,
//   wrongUserName,
//   wrongPassword,
//   lockedOutUserName,
// } from "../test-data/users";
// import type { User } from "../types/auth.types";

// export type AuthFixtures = {
//   inventoryUrl: string;
//   cartUrl: string;
//   validUser: User;
//   emptyUsername: User;
//   emptyPassword: User;
//   wrongUsername: User;
//   wrongPassword: User;
//   lockedOutUser: User;
//   loginPage: LoginPage;
//   loggedInPage: Page;
// };

// export const test = base.extend<AuthFixtures>({
//   validUser: async ({}, use) => {
//     await use({
//       username: validUserName,
//       password: validPassword,
//     });
//   },

//   emptyUsername: async ({}, use) => {
//     await use({
//       username: "",
//       password: validPassword,
//     });
//   },

//   emptyPassword: async ({}, use) => {
//     await use({
//       username: validUserName,
//       password: "",
//     });
//   },

//   wrongUsername: async ({}, use) => {
//     await use({
//       username: wrongUserName,
//       password: validPassword,
//     });
//   },

//   wrongPassword: async ({}, use) => {
//     await use({
//       username: validUserName,
//       password: wrongPassword,
//     });
//   },

//   lockedOutUser: async ({}, use) => {
//     await use({
//       username: lockedOutUserName,
//       password: validPassword,
//     });
//   },

//   loginPage: async ({ page }, use) => {
//     const loginPage = new LoginPage(page);

//     await loginPage.navigateToLoginPage();
//     await use(loginPage);
//   },

//   loggedInPage: async ({ browser }, use, testInfo) => {
//     const storageStatePath = `auth.${testInfo.project.name}.json`;

//     const context = await browser.newContext({
//       storageState: storageStatePath,
//     });
//     const page = await context.newPage();

//     await use(page);
//     await context.close();
//   },
// });

// export { expect } from "@playwright/test";
