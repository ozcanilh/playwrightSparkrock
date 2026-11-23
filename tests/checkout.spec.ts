import { expect, test } from '../fixtures/pomFixtures';
import checkoutData from '../resources/data/checkout.json';
import users from '../resources/data/users.json';

const { customer, product } = checkoutData;
const { postalCode, ...customerName } = customer;

test.describe('SauceDemo checkout', () => {
  test.beforeEach(
    'Start checkout with one product',
    async ({ shop: { inventory, cart, checkout }, shoppingSteps }) => {
      await shoppingSteps.signInAs(users.standard);
      await expect(inventory.title).toHaveText('Products');

      await shoppingSteps.openCartWithProduct(product.name);
      await expect(cart.title).toHaveText('Your Cart');
      await expect(cart.item(product.name)).toBeVisible();

      await cart.startCheckout();
      await expect(checkout.title).toHaveText('Checkout: Your Information');
    },
  );

  test('SD-01 | Place a one-item order', async ({
    shop: { checkout },
    checkoutSteps,
  }) => {
    await test.step('Submit complete customer information', async () => {
      await checkoutSteps.submitCustomerInformation(customer);
      await expect(checkout.title).toHaveText('Checkout: Overview');
    });

    await test.step('Verify the product and item subtotal', async () => {
      await expect(checkout.item(product.name)).toBeVisible();
      await expect(checkout.subtotal).toHaveText(
        `Item total: ${product.subtotal}`,
      );
    });

    await test.step('Finish the order and verify confirmation', async () => {
      await checkout.finishOrder();
      await expect(checkout.title).toHaveText('Checkout: Complete!');
      await expect(checkout.confirmation).toBeVisible();
    });
  });

  test('SD-02 | Require a postal code at checkout', async ({
    shop: { checkout },
    checkoutSteps,
  }) => {
    await test.step('Submit customer information with the postal code empty', async () => {
      await checkoutSteps.submitCustomerInformation(customerName);
    });

    await test.step('Verify the required-field error and the current screen', async () => {
      await expect(checkout.error).toHaveText('Error: Postal Code is required');
      await expect(checkout.title).toHaveText('Checkout: Your Information');
    });

    await test.step('Enter the postal code and proceed to the overview', async () => {
      await checkout.enterPostalCode(postalCode);
      await checkout.submitInformation();
      await expect(checkout.title).toHaveText('Checkout: Overview');
    });
  });
});
