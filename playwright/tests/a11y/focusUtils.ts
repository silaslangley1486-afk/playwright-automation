import type { Page } from "@playwright/test";

export interface ActiveElementInfo {
  tag: string;
  id: string;
  className: string;
  text: string | null;
}

export interface ActiveElementFocusStyles {
  tag: string;
  id: string;
  className: string;
  outlineStyle: string;
  outlineWidth: string;
}

export async function getActiveElementInfo(
  page: Page
): Promise<ActiveElementInfo | null> {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;

    if (!el) return null;

    return {
      tag: el.tagName,
      id: el.id || "",
      className: el.className || "",
      text: el.textContent?.trim() ?? null,
    };
  });
}

export async function getActiveElementFocusStyles(
  page: Page
): Promise<ActiveElementFocusStyles | null> {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;

    if (!el) return null;

    const style = window.getComputedStyle(el);

    return {
      tag: el.tagName,
      id: el.id,
      className: el.className,
      outlineStyle: style.outlineStyle,
      outlineWidth: style.outlineWidth,
    };
  });
}
