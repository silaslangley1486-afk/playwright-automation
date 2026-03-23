import { defineConfig, devices } from "@playwright/test";
import base from "./playwright.base.config";

export default defineConfig({
  ...base,
  globalSetup: "./global-setup.ts",
  use: {
    ...base.use,
    storageState: "auth.json",
  },
  projects: [
    // ───── AUTHENTICATED REGRESSION ─────
    {
      name: "chromium-regression",
      grep: /@regression/,
      grepInvert: /@unauth/,
      use: { ...devices["Desktop Chrome"], trace: "on-first-retry" },
    },
    {
      name: "firefox-regression",
      grep: /@regression/,
      grepInvert: /@unauth/,
      use: { ...devices["Desktop Firefox"], trace: "on-first-retry" },
    },
    {
      name: "webkit-regression",
      grep: /@regression/,
      grepInvert: /@unauth/,
      timeout: 60_000,
      workers: 1,
      use: { ...devices["Desktop Safari"], trace: "on-first-retry" },
    },
  ],
});
