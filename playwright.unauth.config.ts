import { defineConfig, devices } from "@playwright/test";
import base from "./playwright.base.config";

export default defineConfig({
  ...base,
  projects: [
    {
      name: "chromium-unauth",
      grep: /@unauth/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox-unauth",
      grep: /@unauth/,
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit-unauth",
      grep: /@unauth/,
      timeout: 60_000,
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
