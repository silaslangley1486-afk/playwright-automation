import { test, expect } from "../../src/fixtures/auth.fixture";
import { expectKnownA11yFailure } from "../../src/utils/a11y/known-failures";
import { expectNoSeriousOrCriticalAxeViolations } from "../../src/utils/a11y/assertions";
import { tabUntil } from "../../src/utils/a11y/tab-until";
import { routes } from "../../src/utils/routes";
import { getActiveElementFocusStyles } from "../../src/utils/a11y/focus-utils";
import type { ActiveElementInfo } from "../../src/utils/a11y/focus-utils";

const isAddToCartButtonFocused = (info: ActiveElementInfo | null) =>
  info?.tag === "BUTTON" && /^add-to-cart-/.test(info.id);

test("@a11y @smoke @regression onboarding after login", async ({
  inventoryPage,
}) => {
  expectKnownA11yFailure(
    "SauceDemo inventory page contains known accessibility violations"
  );

  await inventoryPage.goto();
  await inventoryPage.page.getByText("Products").waitFor();
  await expectNoSeriousOrCriticalAxeViolations(inventoryPage.page);
});

test.describe("@a11y @regression onboarding after login", () => {
  test("inventory with menu open is accessible", async ({ inventoryPage }) => {
    await inventoryPage.goto();
    await inventoryPage.burgerMenuButton.click();
    await expectNoSeriousOrCriticalAxeViolations(inventoryPage.page, {
      scope: ".bm-menu-wrap",
    });
  });

  test("inventory with one item in the cart is accessible", async ({
    inventoryPage,
  }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart();
    await expectNoSeriousOrCriticalAxeViolations(inventoryPage.page, {
      scope: "#inventory_container",
    });
  });

  test("@a11y @regression tab order can reach first product title link", async ({
    inventoryPage,
  }) => {
    await inventoryPage.goto();

    const productLinkIdRegExp = /^item_\d+_title_link$/;

    const isProductTitleLinkFocused = (info: ActiveElementInfo | null) =>
      info?.tag === "A" &&
      productLinkIdRegExp.test(info.id) &&
      (info.text?.trim()?.length ?? 0) > 0;

    await tabUntil(inventoryPage.page, isProductTitleLinkFocused, {
      debugLabel: "reach first product title link",
      maxTabs: 15,
    });
  });

  test("@a11y @regression keyboard enter activates focused product link", async ({
    inventoryPage,
  }) => {
    await inventoryPage.goto();

    const firstProductLink = inventoryPage.page
      .locator('a[id$="_title_link"]')
      .first();

    await firstProductLink.focus();
    await expect(firstProductLink).toBeFocused();
    await inventoryPage.keyboardNavigator.enter();

    await expect(inventoryPage.page).toHaveURL(
      new RegExp(`${routes.inventoryItem}\\?id=\\d+$`)
    );

    await expect(inventoryPage.productTitle).toBeVisible();
  });

  test("keyboard-only can open menu and logout", async ({ inventoryPage }) => {
    await inventoryPage.goto();
    inventoryPage.burgerMenuButton.focus();
    await expect(inventoryPage.burgerMenuButton).toBeFocused();
    await inventoryPage.keyboardNavigator.enter();

    const logoutButton = inventoryPage.logoutLinkByRole;

    await logoutButton.focus();
    await expect(logoutButton).toBeFocused();
    await inventoryPage.keyboardNavigator.enter();
    await expect(inventoryPage.page).toHaveURL(routes.login);
  });

  test("add-to-cart button has visible focus (observed)", async ({
    inventoryPage,
  }) => {
    await inventoryPage.goto();

    const addToCartButton = inventoryPage.firstAddToCartButtonByRole;

    await addToCartButton.focus();

    const focusStyles = await getActiveElementFocusStyles(inventoryPage.page);

    console.log("Inventory add-to-cart focus styles:", focusStyles);

    // In our own app where a focus style is defined, then I would assert here to test that the style is present and correct.
  });

  test("keyboard-only can activate add-to-cart button", async ({
    inventoryPage,
  }) => {
    await inventoryPage.goto();

    await tabUntil(inventoryPage.page, isAddToCartButtonFocused, {
      debugLabel: "tab until add to cart button",
    });

    await expect(inventoryPage.firstAddToCartButtonByRole).toBeFocused();
    await inventoryPage.keyboardNavigator.enter();
    await expect.poll(() => inventoryPage.getShoppingCartBadgeCount()).toBe(1);
  });
});
