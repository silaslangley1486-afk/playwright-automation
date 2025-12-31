import { defineConfig, devices } from "@playwright/test";
import base from "./playwright.base.config";

export default defineConfig({
  ...base,
  projects: [
    {
      name: "chromium-smoke",
      grep: /@smoke/,
      use: { ...devices["Desktop Chrome"], trace: "retain-on-failure" },
    },
    {
      name: "firefox-smoke",
      grep: /@smoke/,
      use: { ...devices["Desktop Firefox"], trace: "retain-on-failure" },
    },
    {
      name: "webkit-smoke",
      grep: /@smoke/,
      use: { ...devices["Desktop Safari"], trace: "retain-on-failure" },
    },
  ],
});
