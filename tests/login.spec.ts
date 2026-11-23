import { expect, test } from '../fixtures/pomFixtures';
import users from '../resources/data/users.json';

test('SD-03 | Reject a locked demo account', async ({
  shop: { login },
  shoppingSteps,
}) => {
  await test.step('Sign in with the locked demo account', async () => {
    await shoppingSteps.signInAs(users.locked);
  });

  await test.step('Verify the locked-account error and sign-in form', async () => {
    await expect(login.form).toBeVisible();
    await expect(login.error).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.',
    );
  });
});
