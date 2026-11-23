import type { InventoryPage } from '../pages/inventory.page';
import type { LoginPage } from '../pages/login.page';

type DemoAccount = { username: string; password: string };

export class ShoppingSteps {
  constructor(
    private readonly login: LoginPage,
    private readonly inventory: InventoryPage,
  ) {}

  async signInAs({ username, password }: DemoAccount) {
    await this.login.open();
    await this.login.signIn(username, password);
  }

  async openCartWithProduct(productName: string) {
    await this.inventory.addProduct(productName);
    await this.inventory.openCart();
  }
}
