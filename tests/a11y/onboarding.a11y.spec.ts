import { test, expect } from "../../src/fixtures/auth.fixture.js";
import { expectNoAutomatedWCAGViolations } from "../../src/utils/a11y/assertions.js";
import { routes } from "../../src/utils/routes.js";
import { getActiveElementFocusStyles } from "../../src/utils/a11y/focus-utils.js";

test("@a11y @smoke @regression onboarding after login", async ({
  inventoryPage,
}) => {
  await inventoryPage.goto();
  await inventoryPage.page.getByText("Products").waitFor();
  await expectNoAutomatedWCAGViolations(inventoryPage.page);

  // This test will fail because the saucedemo inventory page has accessibility issues.
});

test.describe("@a11y @regression onboarding after login", () => {
  test("inventory with menu open is accessible", async ({ inventoryPage }) => {
    await inventoryPage.goto();
    await inventoryPage.burgerMenuButton.click();
    await expectNoAutomatedWCAGViolations(inventoryPage.page, {
      scope: ".bm-menu-wrap",
    });
  });

  test("inventory with one item in the cart is accessible", async ({
    inventoryPage,
  }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart();
    await expectNoAutomatedWCAGViolations(inventoryPage.page, {
      scope: "#inventory_container",
    });
  });

  test("keyboard-only can open product", async ({ inventoryPage }) => {
    await inventoryPage.goto();
    await inventoryPage.keyboardNavigator.tab();
    await inventoryPage.keyboardNavigator.tab();
    await inventoryPage.keyboardNavigator.tab();
    await inventoryPage.keyboardNavigator.enter();

    await expect(inventoryPage.page).toHaveURL(
      new RegExp(`${routes.inventoryItem}\\?id=\\d+$`)
    );

    await expect(inventoryPage.productTitle).toBeVisible();
  });

  test("keyboard-only can open menu and logout", async ({ inventoryPage }) => {
    await inventoryPage.goto();
    await inventoryPage.keyboardNavigator.tab();
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

    const addToCartButton = inventoryPage.firstAddToCartButtonByRole;

    await addToCartButton.focus();
    await expect(addToCartButton).toBeFocused();
    await inventoryPage.keyboardNavigator.enter();
    await expect.poll(() => inventoryPage.getShoppingCartBadgeCount()).toBe(1);
  });
});
