import { Page, Locator } from "@playwright/test";
import { routes } from "../src/utils/routes";
import { KeyboardNavigator } from "../src/utils/keyboard-navigator";

export class InventoryPage {
  readonly page: Page;
  readonly keyboardNavigator: KeyboardNavigator;
  readonly title: Locator;
  readonly inventoryList: Locator;
  readonly inventoryItem: Locator;
  readonly productTitle: Locator;
  readonly backToProductsButton: Locator;
  readonly burgerMenuButton: Locator;
  readonly cartLink: Locator;
  readonly sortContainer: Locator;
  readonly shoppingCartBadge: Locator;
  readonly shoppingCartLink: Locator;
  readonly logoutSidebarLink: Locator;
  readonly removeItemButton: Locator;
  readonly firstAddToCartButtonByRole: Locator;
  readonly logoutLinkByRole: Locator;

  constructor(page: Page) {
    this.page = page;
    this.keyboardNavigator = new KeyboardNavigator(page);
    this.title = this.page
      .getByText("Products")
      .or(page.locator('[data-test="title"]'));

    this.inventoryList = page.locator('[data-test="inventory-list"]');
    this.inventoryItem = page.locator('[data-test="inventory-item"]');
    this.productTitle = page.locator('[data-test="inventory-item-name"]');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
    this.burgerMenuButton = page.locator("#react-burger-menu-btn");
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.sortContainer = page.locator('[data-test="product-sort-container"]');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.logoutSidebarLink = page.locator('[data-test="logout-sidebar-link"]');
    this.removeItemButton = page.locator(
      '[data-test="remove-sauce-labs-backpack"]'
    );

    this.firstAddToCartButtonByRole = page
      .locator(".inventory_item")
      .getByRole("button", { name: /add/i })
      .first();

    this.logoutLinkByRole = page
      .locator(".bm-item-list")
      .getByRole("link", { name: "Logout" });
  }

  async goto() {
    await this.page.goto(routes.inventory);
  }

  async logout() {
    await this.burgerMenuButton.click();
    await this.logoutSidebarLink.click();
  }

  async getFirstProductName(): Promise<string> {
    const firstProduct = this.inventoryItem.first();

    return (
      (await firstProduct
        .locator('[data-test="inventory-item-name"]')
        .textContent()) ?? ""
    );
  }

  async hasAProduct(): Promise<boolean> {
    return await this.inventoryItem.first().isVisible();
  }

  async hasAProductNameAndPrice(): Promise<boolean> {
    const firstProduct = this.inventoryItem.first();
    const productName = firstProduct.locator(
      '[data-test="inventory-item-name"]'
    );
    const productPrice = firstProduct.locator(
      '[data-test="inventory-item-price"]'
    );

    return (await productName.isVisible()) && (await productPrice.isVisible());
  }

  async getFirstProductPrice(): Promise<string> {
    const firstProduct = this.inventoryItem.first();

    return (
      (await firstProduct
        .locator('[data-test="inventory-item-price"]')
        .textContent()) ?? ""
    );
  }

  async openFirstProductDetails(): Promise<void> {
    const firstProductNameLocator = this.inventoryItem
      .first()
      .locator('[data-test="inventory-item-name"]');

    await firstProductNameLocator.click();
  }

  async addToCart() {
    const addToCartButton = await this.getFirstAddToCartButton();

    await addToCartButton.click();
  }

  async getFirstAddToCartButton() {
    const firstProduct = this.inventoryItem.first();

    return firstProduct.locator('[data-test^="add-to-cart-"]');
  }

  async getShoppingCartBadgeCount(): Promise<number> {
    const badge = await this.shoppingCartBadge.textContent();

    return badge ? parseInt(badge) : 0;
  }

  async getFirstCartItemName(): Promise<string> {
    const cartItem = this.inventoryItem.first();
    const cartItemNameLocator = cartItem.locator(
      '[data-test="inventory-item-name"]'
    );

    return (await cartItemNameLocator.textContent()) ?? "";
  }

  async hasRemoveButton(): Promise<boolean> {
    const firstProduct = this.inventoryItem.first();
    const removeButton = firstProduct.locator('[data-test^="remove-"]');

    return await removeButton.isVisible();
  }
}
