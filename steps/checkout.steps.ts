import type { CheckoutPage } from '../pages/checkout.page';

type CustomerInformation = {
  firstName: string;
  lastName: string;
  postalCode?: string;
};

export class CheckoutSteps {
  constructor(private readonly checkout: CheckoutPage) {}

  async submitCustomerInformation({
    firstName,
    lastName,
    postalCode,
  }: CustomerInformation) {
    await this.checkout.enterName(firstName, lastName);
    if (postalCode !== undefined) {
      await this.checkout.enterPostalCode(postalCode);
    }
    await this.checkout.submitInformation();
  }
}
