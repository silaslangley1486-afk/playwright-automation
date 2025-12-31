import { defineConfig, devices } from "@playwright/test";
import base from "./playwright.base.config";

export default defineConfig({
  ...base,
  projects: [
    {
      name: "chromium-regression",
      grep: /@regression/,
      use: { ...devices["Desktop Chrome"], trace: "on-first-retry" },
    },
    {
      name: "firefox-regression",
      grep: /@regression/,
      use: { ...devices["Desktop Firefox"], trace: "on-first-retry" },
    },
    {
      name: "webkit-regression",
      grep: /@regression/,
      use: { ...devices["Desktop Safari"], trace: "on-first-retry" },
    },
  ],
});
