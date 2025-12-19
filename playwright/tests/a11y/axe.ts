import { AxeBuilder } from "@axe-core/playwright";
import type { Page } from "@playwright/test";

export const axeFor = (page: Page) =>
  new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]);
