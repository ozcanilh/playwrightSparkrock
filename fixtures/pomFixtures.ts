import { test as base } from '@playwright/test';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';
import { InventoryPage } from '../pages/inventory.page';
import { LoginPage } from '../pages/login.page';
import { CheckoutSteps } from '../steps/checkout.steps';
import { ShoppingSteps } from '../steps/shopping.steps';

type ShopPages = {
  login: LoginPage;
  inventory: InventoryPage;
  cart: CartPage;
  checkout: CheckoutPage;
};

export const test = base.extend<{
  shop: ShopPages;
  checkoutSteps: CheckoutSteps;
  shoppingSteps: ShoppingSteps;
}>({
  shop: async ({ page }, use) => {
    await use({
      login: new LoginPage(page),
      inventory: new InventoryPage(page),
      cart: new CartPage(page),
      checkout: new CheckoutPage(page),
    });
  },

  checkoutSteps: async ({ shop }, use) => {
    await use(new CheckoutSteps(shop.checkout));
  },

  shoppingSteps: async ({ shop }, use) => {
    await use(new ShoppingSteps(shop.login, shop.inventory));
  },
});

export { expect } from '@playwright/test';
