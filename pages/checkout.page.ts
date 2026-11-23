import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class CheckoutPage extends BasePage {
  readonly title: Locator;
  readonly error: Locator;
  readonly subtotal: Locator;
  readonly confirmation: Locator;
  private readonly itemNames: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly finishButton: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.getByTestId('title');
    this.error = page.getByTestId('error');
    this.subtotal = page.getByTestId('subtotal-label');
    this.confirmation = page.getByRole('heading', {
      name: 'Thank you for your order!',
      exact: true,
    });
    this.itemNames = page.getByTestId('inventory-item-name');
    this.firstNameInput = page.getByPlaceholder('First Name', { exact: true });
    this.lastNameInput = page.getByPlaceholder('Last Name', { exact: true });
    this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code', {
      exact: true,
    });
    this.continueButton = page.getByRole('button', {
      name: 'Continue',
      exact: true,
    });
    this.finishButton = page.getByRole('button', {
      name: 'Finish',
      exact: true,
    });
  }

  item(name: string): Locator {
    return this.itemNames.and(this.page.getByText(name, { exact: true }));
  }

  async enterName(firstName: string, lastName: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
  }

  async enterPostalCode(postalCode: string) {
    await this.postalCodeInput.fill(postalCode);
  }

  async submitInformation() {
    await this.continueButton.click();
  }

  async finishOrder() {
    await this.finishButton.click();
  }
}
