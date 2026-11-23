import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class CartPage extends BasePage {
  readonly title: Locator;
  readonly items: Locator;
  readonly badge: Locator;
  private readonly itemNames: Locator;
  private readonly checkoutButton: Locator;
  private readonly removeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('cart-list').getByTestId('inventory-item');
    this.badge = page.getByTestId('shopping-cart-badge');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.checkoutButton = page.getByRole('button', {
      name: 'Checkout',
      exact: true,
    });
    this.removeButton = page.getByRole('button', {
      name: 'Remove',
      exact: true,
    });
  }

  item(name: string): Locator {
    return this.itemNames.and(this.page.getByText(name, { exact: true }));
  }

  async startCheckout() {
    await this.checkoutButton.click();
  }

  async removeItem(name: string) {
    const row = this.items.filter({ has: this.item(name) });
    await row.locator(this.removeButton).click();
  }
}
