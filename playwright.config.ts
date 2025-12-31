import { defineConfig, devices } from "@playwright/test";
import base from "./playwright.base.config";

export default defineConfig({
  ...base,
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});

// import { defineConfig, devices } from "@playwright/test";

// /**
//  * See https://playwright.dev/docs/test-configuration.
//  */
// export default defineConfig({
//   testDir: "./tests",
//   testIgnore: ["**/codegen/**"],
//   fullyParallel: true,
//   reporter: "html",
//   /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
//   use: {
//     /* Base URL to use in actions like `await page.goto('')`. */
//     // baseURL: 'http://localhost:3000',

//     /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
//     baseURL: "https://www.saucedemo.com",
//     trace: "on-first-retry",
//     headless: true,
//     screenshot: "only-on-failure",
//   },

//   projects: [
//     {
//       name: "chromium",
//       use: { ...devices["Desktop Chrome"] },
//     },

//     {
//       name: "firefox",
//       use: { ...devices["Desktop Firefox"] },
//     },
//     {
//       name: "webkit",
//       use: { ...devices["Desktop Safari"] },
//     },

//     // ───── SMOKE PROJECTS ─────
//     {
//       name: "chromium-smoke",
//       grep: /@smoke/,
//       use: {
//         ...devices["Desktop Chrome"],
//         trace: "retain-on-failure",
//       },
//     },
//     {
//       name: "firefox-smoke",
//       grep: /@smoke/,
//       use: {
//         ...devices["Desktop Firefox"],
//         trace: "retain-on-failure",
//       },
//     },
//     {
//       name: "webkit-smoke",
//       grep: /@smoke/,
//       use: {
//         ...devices["Desktop Safari"],
//         trace: "retain-on-failure",
//       },
//     },

//     // ───── REGRESSION PROJECTS ─────
//     {
//       name: "chromium-regression",
//       grep: /@regression/,
//       use: {
//         ...devices["Desktop Chrome"],
//         trace: "on-first-retry",
//       },
//     },
//     {
//       name: "firefox-regression",
//       grep: /@regression/,
//       use: {
//         ...devices["Desktop Firefox"],
//         trace: "on-first-retry",
//       },
//     },
//     {
//       name: "webkit-regression",
//       grep: /@regression/,
//       timeout: 60_000,
//       workers: 1,
//       use: {
//         ...devices["Desktop Safari"],
//         trace: "on-first-retry",
//       },
//     },
//   ],
// });
