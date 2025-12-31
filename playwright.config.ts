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
