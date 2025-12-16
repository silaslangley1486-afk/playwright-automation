import { test, expect } from "../../fixtures/auth.fixture.js";
import { loginUrl, inventoryUrl } from "../../constants/url.constants";

test("post-login landing shows main inventory page content", async ({
  page,
  trueUser,
  loginPage,
}) => {
  await loginPage.login(trueUser);
  await expect(page).toHaveURL(inventoryUrl);
  await expect(page.locator('[data-test="inventory-list"]')).toBeVisible();
  await expect(page.locator("#react-burger-menu-btn")).toBeVisible();
  await expect(page.locator('[data-test="title"]')).toBeVisible();
  await expect(page.locator('[data-test="shopping-cart-link"]')).toBeVisible();
  await expect(
    page.locator('[data-test="product-sort-container"]')
  ).toBeVisible();
});

test("post-login landing shows at least one product card with product title and price", async ({
  page,
  trueUser,
  loginPage,
}) => {
  await loginPage.login(trueUser);
  await expect(page).toHaveURL(inventoryUrl);

  const firstProduct = page.locator('[data-test="inventory-item"]').first();
  const firstProductPrice = firstProduct.locator(
    '[data-test="inventory-item-price"]'
  );
  const priceText = await firstProductPrice.textContent();

  await expect(
    firstProduct.locator('[data-test="inventory-item-name"]')
  ).toBeVisible();

  await expect(firstProductPrice).toBeVisible();

  // This regex handles optional commas and ensures exactly two decimal places for USD:
  // ^\$\d{1,3}(,\d{3})*(\.\d{2})?$
  // Note: Escaped slashes are needed in JS strings for some regex characters.
  const currencyRegex = /^\$\d{1,3}(,\d{3})*(\.\d{2})?$/;

  expect(priceText).toMatch(currencyRegex);
});

test("product details page opens when clicking a product title from inventory", async ({
  page,
  trueUser,
  loginPage,
}) => {
  await loginPage.login(trueUser);
  await expect(page).toHaveURL(inventoryUrl);

  const firstProduct = page.locator('[data-test="inventory-item"]').first();
  const firstProductNameLocator = firstProduct.locator(
    '[data-test="inventory-item-name"]'
  );
  const firstProductName = await firstProductNameLocator.textContent();

  await firstProductNameLocator.click();
  await expect(page).toHaveURL(
    /https:\/\/www\.saucedemo\.com\/inventory-item\.html\?id=\d+/
  );

  const productTitle = page.locator('[data-test="inventory-item-name"]');
  const productTitleText = await productTitle.textContent();
  const backToProductsButton = page.locator('[data-test="back-to-products"]');

  await expect(productTitle).toBeVisible();
  await expect(backToProductsButton).toBeVisible();
  expect(productTitleText).toBe(firstProductName);
  await backToProductsButton.click();
  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
});

test("shopping cart is initially empty upon first login", async ({
  page,
  trueUser,
  loginPage,
}) => {
  await loginPage.login(trueUser);
  await expect(page).toHaveURL(inventoryUrl);

  const cartBadge = page.locator('[data-test="shopping-cart-badge"]');

  await expect(cartBadge).toHaveCount(0);
});

test("logout via side menu works correctly", async ({
  page,
  trueUser,
  loginPage,
}) => {
  await loginPage.login(trueUser);
  await expect(page).toHaveURL(inventoryUrl);
  await page.locator("#react-burger-menu-btn").click();
  await page.locator('[data-test="logout-sidebar-link"]').click();
  await expect(page).toHaveURL(loginUrl);
});

test("add to cart works correctly from inventory page", async ({
  page,
  trueUser,
  loginPage,
}) => {
  await loginPage.login(trueUser);
  await expect(page).toHaveURL(inventoryUrl);

  const firstProduct = page.locator('[data-test="inventory-item"]').first();
  const firstProductNameLocator = firstProduct.locator(
    '[data-test="inventory-item-name"]'
  );
  const firstProductName = await firstProductNameLocator.textContent();
  const addToCartButton = firstProduct.locator(
    '[data-test="add-to-cart-sauce-labs-backpack"]'
  );

  await addToCartButton.click();

  const cartBadge = page.locator('[data-test="shopping-cart-badge"]');

  await expect(cartBadge).toHaveText("1");
  await page.locator('[data-test="shopping-cart-link"]').click();
  await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");

  const cartItem = page.locator('[data-test="inventory-item"]').first();
  const cartItemNameLocator = cartItem.locator(
    '[data-test="inventory-item-name"]'
  );
  const cartItemName = await cartItemNameLocator.textContent();

  expect(cartItemName).toBe(firstProductName);
});
