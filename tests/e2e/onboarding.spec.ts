import { test, expect } from "../../src/fixtures/auth.fixture.js";
import { routes } from "../../src/utils/routes.js";
import { InventoryPage } from "../../pages/inventory-page";
import { currencyRegex } from "../../src/utils/regex.js";

test.describe("@smoke onboarding", () => {
  test.describe.configure({ mode: "serial", retries: 0, timeout: 25_000 });

  test("@smoke inventory is usable", async ({ inventoryPage }) => {
    await inventoryPage.goto();
    await expect(inventoryPage.inventoryList).toBeVisible();
    await expect(inventoryPage.cartLink).toBeVisible();
    await expect(inventoryPage.burgerMenuButton).toBeVisible();
  });

  test("logout via side menu works correctly", async ({ inventoryPage }) => {
    await inventoryPage.goto();
    await inventoryPage.logout();
    await expect(inventoryPage.page).toHaveURL(routes.login);
  });

  test("add to cart works correctly from inventory page", async ({
    inventoryPage,
  }) => {
    await inventoryPage.goto();

    const firstProductName = await inventoryPage.getFirstProductName();

    await inventoryPage.addToCart();

    await expect.poll(() => inventoryPage.getShoppingCartBadgeCount()).toBe(1);
    await inventoryPage.shoppingCartLink.click();
    await expect(inventoryPage.page).toHaveURL(routes.cart);
    expect(await inventoryPage.hasRemoveButton()).toBe(true);

    const cartItemName = await inventoryPage.getFirstCartItemName();

    expect(cartItemName).toBe(firstProductName);
  });

  test("user can login, add first product to cart, and logout", async ({
    validUser,
    loginPage,
  }) => {
    await loginPage.login(validUser);
    await expect(loginPage.page).toHaveURL(routes.inventory);

    const inventoryPage = new InventoryPage(loginPage.page);

    await expect(inventoryPage.inventoryList).toBeVisible();
    await inventoryPage.addToCart();
    await expect.poll(() => inventoryPage.getShoppingCartBadgeCount()).toBe(1);
    await inventoryPage.logout();
    await expect(inventoryPage.page).toHaveURL(routes.login);
  });
});

test.describe("@regression onboarding / post-login", () => {
  test.describe.configure({ mode: "parallel", retries: 1, timeout: 30_000 });

  test("post-login landing shows main inventory page content", async ({
    inventoryPage,
  }) => {
    await inventoryPage.goto();
    await expect.soft(inventoryPage.inventoryList).toBeVisible();
    await expect.soft(inventoryPage.burgerMenuButton).toBeVisible();
    await expect.soft(inventoryPage.title).toBeVisible();
    await expect.soft(inventoryPage.cartLink).toBeVisible();
    await expect.soft(inventoryPage.sortContainer).toBeVisible();
  });

  test("post-login landing shows at least one product card with product title and price", async ({
    inventoryPage,
  }) => {
    await inventoryPage.goto();

    expect(await inventoryPage.hasAProduct()).toBe(true);
    expect(await inventoryPage.hasAProductNameAndPrice()).toBe(true);

    const priceText = await inventoryPage.getFirstProductPrice();

    expect(priceText).toMatch(currencyRegex);
  });

  test("product details page opens when clicking a product title from inventory", async ({
    inventoryPage,
  }) => {
    await inventoryPage.goto();

    const firstProductName = await inventoryPage.getFirstProductName();

    await inventoryPage.openFirstProductDetails();
    await expect(inventoryPage.page).toHaveURL(
      new RegExp(`${routes.inventoryItem}\\?id=\\d+$`)
    );

    await expect(inventoryPage.productTitle).toBeVisible();
    await expect(inventoryPage.backToProductsButton).toBeVisible();
    await expect(inventoryPage.productTitle).toHaveText(firstProductName);
    await inventoryPage.backToProductsButton.click();
    await expect(inventoryPage.page).toHaveURL(routes.inventory);
  });

  test("cart is empty for authenticated user", async ({ inventoryPage }) => {
    await inventoryPage.goto();
    await expect(inventoryPage.shoppingCartBadge).toHaveCount(0);
  });
});
