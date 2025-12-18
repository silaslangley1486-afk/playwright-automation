import { Page, Locator } from "@playwright/test";
import { routes } from "../constants/routes";

export class InventoryPage {
  readonly page: Page;
  readonly inventoryList: Locator;
  readonly inventoryItem: Locator;
  readonly productTitle: Locator;
  readonly backToProductsButton: Locator;
  readonly burgerMenuButton: Locator;
  readonly title: Locator;
  readonly cartLink: Locator;
  readonly sortContainer: Locator;
  readonly shoppingCartBadge: Locator;
  readonly shoppingCartLink: Locator;
  readonly logoutSidebarLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryList = page.locator('[data-test="inventory-list"]');
    this.inventoryItem = page.locator('[data-test="inventory-item"]');
    this.productTitle = page.locator('[data-test="inventory-item-name"]');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
    this.burgerMenuButton = page.locator("#react-burger-menu-btn");
    this.title = page.locator('[data-test="title"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.sortContainer = page.locator('[data-test="product-sort-container"]');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.logoutSidebarLink = page.locator('[data-test="logout-sidebar-link"]');
  }

  async goto() {
    await this.page.goto(routes.inventory);
  }

  async logout() {
    await this.burgerMenuButton.click();
    await this.logoutSidebarLink.click();
  }
}
