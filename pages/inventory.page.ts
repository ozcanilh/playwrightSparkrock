import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class InventoryPage extends BasePage {
  readonly title: Locator;
  private readonly productCards: Locator;
  private readonly addToCartButton: Locator;
  private readonly cartLink: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.getByTestId('title');
    this.productCards = page.getByTestId('inventory-item');
    this.addToCartButton = page.getByRole('button', {
      name: 'Add to cart',
      exact: true,
    });
    this.cartLink = page.getByTestId('shopping-cart-link');
  }

  async addProduct(product: string) {
    const item = this.productCards.filter({
      has: this.page.getByText(product, { exact: true }),
    });
    await item.locator(this.addToCartButton).click();
  }

  async openCart() {
    await this.cartLink.click();
  }
}
