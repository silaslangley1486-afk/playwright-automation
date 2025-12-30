import type { Page } from "@playwright/test";
import { getActiveElementInfo } from "./focus-utils";

/**
 * Tabs until the active element matches `isTargetFocused`, or throws after `maxTabs`.
 * Returns the last active element info (useful for debugging).
 */
export async function tabUntil(
  page: Page,
  isTargetFocused: (
    activeElementInfo: Awaited<ReturnType<typeof getActiveElementInfo>>
  ) => boolean,
  options?: { maxTabs?: number; debugLabel?: string }
): Promise<void> {
  const defaultMaxTabs = 25;
  const maxTabs = options?.maxTabs ?? defaultMaxTabs;

  for (let i = 0; i < maxTabs; i++) {
    await page.keyboard.press("Tab");

    const activeElementInfo = await getActiveElementInfo(page);

    if (isTargetFocused(activeElementInfo)) return;
  }

  const activeElementInfo = await getActiveElementInfo(page);
  const label = options?.debugLabel ? ` (${options.debugLabel})` : "";

  throw new Error(
    `tabUntil${label}: did not reach target within ${maxTabs} Tab presses. ` +
      `Last active element: ${JSON.stringify(activeElementInfo)}`
  );
}
