import { expect, test } from '../fixtures/pomFixtures';
import checkoutData from '../resources/data/checkout.json';
import users from '../resources/data/users.json';

const { product } = checkoutData;

test('SD-04 | Remove the last cart item', async ({
  shop: { cart },
  shoppingSteps,
}) => {
  await test.step('Open the cart with one product', async () => {
    await shoppingSteps.signInAs(users.standard);
    await shoppingSteps.openCartWithProduct(product.name);

    await expect(cart.title).toHaveText('Your Cart');
    await expect(cart.items).toHaveCount(1);
    await expect(cart.item(product.name)).toBeVisible();
    await expect(cart.badge).toHaveText('1');
  });

  await test.step('Remove the product and verify the empty cart', async () => {
    await cart.removeItem(product.name);

    await expect(cart.title).toHaveText('Your Cart');
    await expect(cart.items).toHaveCount(0);
    await expect(cart.badge).toHaveCount(0);
  });
});
