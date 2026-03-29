import { defineConfig, devices } from "@playwright/test";
import base from "./playwright.base.config";

export default defineConfig({
  ...base,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], storageState: "auth.json" },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"], storageState: "auth.json" },
    },
    {
      name: "webkit",
      timeout: 90_000,
      use: { ...devices["Desktop Safari"], storageState: "auth.json" },
    },
  ],
});
