import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testIgnore: ["**/codegen/**"],
  fullyParallel: true,

  reporter: [["list"], ["html", { open: "never" }]],

  use: {
    baseURL: "https://www.saucedemo.com",
    headless: true,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
});
