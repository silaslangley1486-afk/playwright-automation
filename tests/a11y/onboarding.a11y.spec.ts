import { test, expect } from "../../src/fixtures/auth.fixture.js";
import { expectNoSeriousA11yViolations } from "./asssertions.js";
import { routes } from "../../src/utils/routes.js";
import { getActiveElementFocusStyles } from "./focusUtils";

test("@a11y @smoke @regression onboarding after login", async ({
  inventoryPage,
  page,
}) => {
  await inventoryPage.goto();
  await inventoryPage.page.getByText("Products").waitFor();
  await expectNoSeriousA11yViolations(inventoryPage.page);

  // This test will fail because the saucedemo inventory page has accessibility issues.
});

test.describe("@a11y @regression onboarding after login", () => {
  test("inventory with menu open is accessible", async ({
    inventoryPage,
    page,
  }) => {
    await inventoryPage.goto();
    await inventoryPage.burgerMenuButton.click();
    await expectNoSeriousA11yViolations(inventoryPage.page, {
      scope: ".bm-menu-wrap",
    });
  });

  test("inventory with one item in the cart is accessible", async ({
    inventoryPage,
    page,
  }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart();
    await expectNoSeriousA11yViolations(inventoryPage.page, {
      scope: "#inventory_container",
    });
  });

  test("keyboard-only can open product", async ({ page, inventoryPage }) => {
    await inventoryPage.goto();
    await inventoryPage.page.keyboard.press("Tab");
    await inventoryPage.page.keyboard.press("Tab");
    await inventoryPage.page.keyboard.press("Tab");
    await inventoryPage.page.keyboard.press("Enter");

    await expect(inventoryPage.page).toHaveURL(
      new RegExp(`${routes.inventoryItem}\\?id=\\d+$`)
    );

    await expect(inventoryPage.productTitle).toBeVisible();
  });

  test("keyboard-only can open menu and logout", async ({
    page,
    inventoryPage,
  }) => {
    await inventoryPage.goto();
    await inventoryPage.page.keyboard.press("Tab");
    await inventoryPage.page.keyboard.press("Enter");

    const logoutButton = inventoryPage.logoutLinkByRole;

    await logoutButton.focus();
    await expect(logoutButton).toBeFocused();
    await inventoryPage.page.keyboard.press("Enter");
    await expect(inventoryPage.page).toHaveURL(routes.login);
  });

  test("add-to-cart button has visible focus (observed)", async ({
    page,
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
    page,
    inventoryPage,
  }) => {
    await inventoryPage.goto();

    const addToCartButton = inventoryPage.firstAddToCartButtonByRole;

    await addToCartButton.focus();
    await expect(addToCartButton).toBeFocused();
    await inventoryPage.page.keyboard.press("Enter");
    await expect.poll(() => inventoryPage.getShoppingCartBadgeCount()).toBe(1);
  });
});
