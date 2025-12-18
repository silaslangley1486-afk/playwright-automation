import { test, expect } from "../../fixtures/auth.fixture.js";
import { routes } from "../../constants/routes.js";
import { InventoryPage } from "../../models/inventory-page";
import { currencyRegex } from "../../constants/currrency.js";

test.describe("Onboarding / post-login", () => {
  test("@smoke post-login landing shows main inventory page content", async ({
    inventoryPage,
  }) => {
    await inventoryPage.goto();
    await expect(inventoryPage.inventoryList).toBeVisible();
    await expect(inventoryPage.burgerMenuButton).toBeVisible();
    await expect(inventoryPage.title).toBeVisible();
    await expect(inventoryPage.cartLink).toBeVisible();
    await expect(inventoryPage.sortContainer).toBeVisible();
  });

  test("post-login landing shows at least one product card with product title and price", async ({
    inventoryPage,
  }) => {
    await inventoryPage.goto();

    expect(await inventoryPage.hasAProduct()).toBe(true);
    expect(await inventoryPage.hasAProductNameAndPrice()).toBe(true);

    // const firstProduct = inventoryPage.inventoryItem.first();
    // const firstProductPrice = firstProduct.locator(
    //   '[data-test="inventory-item-price"]'
    // );
    // const priceText = await firstProductPrice.textContent();

    // await expect(
    //   firstProduct.locator('[data-test="inventory-item-name"]')
    // ).toBeVisible();

    // await expect(firstProductPrice).toBeVisible();

    const priceText = await inventoryPage.getFirstProductPrice();

    // This regex handles optional commas and ensures exactly two decimal places for USD:
    // ^\$\d{1,3}(,\d{3})*(\.\d{2})?$
    // Note: Escaped slashes are needed in JS strings for some regex characters.
    // const currencyRegex = /^\$\d{1,3}(,\d{3})*(\.\d{2})?$/;

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

    // const firstProduct = inventoryPage.inventoryItem.first();
    // const firstProductNameLocator = firstProduct.locator(
    //   '[data-test="inventory-item-name"]'
    // );
    // const firstProductName = await firstProductNameLocator.textContent();

    // await firstProductNameLocator.click();
    // await expect(inventoryPage.page).toHaveURL(
    //   new RegExp(`${routes.inventoryItem}\\?id=\\d+$`)
    // );

    // const productTitleText = await inventoryPage.productTitle.textContent();
    // const backToProductsButton = inventoryPage.backToProductsButton;

    // await expect(inventoryPage.productTitle).toBeVisible();
    // await expect(backToProductsButton).toBeVisible();
    // expect(productTitleText).toBe(firstProductName);
    // await backToProductsButton.click();
    // await expect(inventoryPage.page).toHaveURL(routes.inventory);
  });

  test("cart is empty for authenticated user", async ({ inventoryPage }) => {
    await inventoryPage.goto();
    await expect(inventoryPage.shoppingCartBadge).toHaveCount(0);
  });

  test("@smoke logout via side menu works correctly", async ({
    inventoryPage,
  }) => {
    await inventoryPage.goto();
    await inventoryPage.logout();
    await expect(inventoryPage.page).toHaveURL(routes.login);
  });

  test("@smoke add to cart works correctly from inventory page", async ({
    inventoryPage,
  }) => {
    await inventoryPage.goto();

    // const firstProduct = inventoryPage.inventoryItem.first();
    // const firstProductNameLocator = firstProduct.locator(
    //   '[data-test="inventory-item-name"]'
    // );
    // const firstProductName = await firstProductNameLocator.textContent();
    // const addToCartButton = firstProduct.locator(
    //   '[data-test="add-to-cart-sauce-labs-backpack"]'
    // );

    // await addToCartButton.click();

    const firstProductName = await inventoryPage.getFirstProductName();

    await inventoryPage.addToCart();
    await expect(inventoryPage.shoppingCartBadge).toHaveText("1");
    await inventoryPage.shoppingCartLink.click();
    await expect(inventoryPage.page).toHaveURL(routes.cart);
    expect(await inventoryPage.hasRemoveButton()).toBe(true);

    const cartItemName = await inventoryPage.getFirstCartItemName();

    expect(cartItemName).toBe(firstProductName);

    // const cartItem = inventoryPage.inventoryItem.first();
    // const cartItemNameLocator = cartItem.locator(
    //   '[data-test="inventory-item-name"]'
    // );
    // const cartItemName = await cartItemNameLocator.textContent();
  });

  test("@smoke user can login, add first product to cart, and logout", async ({
    validUser,
    loginPage,
  }) => {
    await loginPage.login(validUser);
    await expect(loginPage.page).toHaveURL(routes.inventory);

    const inventoryPage = new InventoryPage(loginPage.page);

    await expect(inventoryPage.inventoryList).toBeVisible();
    await inventoryPage.addToCart();
    await expect(inventoryPage.shoppingCartBadge).toHaveText("1");
    await inventoryPage.logout();
    await expect(inventoryPage.page).toHaveURL(routes.login);
  });
});
