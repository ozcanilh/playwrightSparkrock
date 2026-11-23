# SauceDemo test design

## Feature coverage and rationale

The assessment covers the desktop shopping flow from account sign-in and product selection through cart changes and simulated checkout. [Sauce Labs sample application](https://github.com/saucelabs/sample-app-web)

- **Checkout (SD-01 and SD-02).** Automate the purchase path because a shopper must be able to place an order. Verify the selected item and subtotal at review. Use the empty postal code boundary to check that validation blocks review and lets the shopper continue after correcting the input.
- **Sign-in (SD-03).** Verify that a locked account stays on the sign-in form and sees a clear reason why sign-in was blocked.
- **Cart (SD-04).** Check the one-to-zero item boundary because the cart must update its contents and count together.

## Strategy

Run all four [automated cases](../tests/) in Chrome and Firefox. Each test starts in a fresh browser context so session and cart state stay isolated during parallel runs. Shared Steps handle sign-in, cart setup and checkout form submission. Web-first assertions check shopper-visible results at each state change, and HTML reports retain steps and failure evidence.

## Test cases

Each case pairs a test step with its expected result and lists the state required before Step 1. Use a fresh browser session to open the [demo URL](../resources/data/environment.json). The [demo accounts](../resources/data/users.json) and [checkout data](../resources/data/checkout.json) provide the case inputs. [TestRail Test Case (Steps) format](https://support.testrail.com/hc/en-us/articles/14927678348052-Test-case-templates)

### Shared checkout setup for SD-01 and SD-02

The [checkout spec](../tests/checkout.spec.ts) runs this setup before each checkout case.

| #   | Step                                         | Expected Result                     |
| --- | -------------------------------------------- | ----------------------------------- |
| 1   | Sign in with the standard demo account.      | The `Products` screen opens.        |
| 2   | Add `Sauce Labs Backpack` and open the cart. | `Your Cart` shows the backpack.     |
| 3   | Click `Checkout`.                            | `Checkout: Your Information` opens. |

### SD-01 | Place a one-item order

**High priority · Positive · Automated** · [Playwright spec](../tests/checkout.spec.ts)

#### Preconditions

- An active internet connection is available.
- Open SauceDemo in a fresh Google Chrome session and complete the [shared checkout setup](#shared-checkout-setup-for-sd-01-and-sd-02).
- The checkout information form is open, and the cart contains only `Sauce Labs Backpack`.

#### Steps and expected results

| #   | Step                                                                                                       | Expected Result                                                             |
| --- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 1   | Enter `Ada`, `Tester`, and `12345` in the first name, last name, and postal code fields. Click `Continue`. | `Checkout: Overview` opens.                                                 |
| 2   | Review the selected item and subtotal.                                                                     | The overview lists `Sauce Labs Backpack` and displays `Item total: $29.99`. |
| 3   | Click `Finish`.                                                                                            | `Checkout: Complete!` shows `Thank you for your order!`.                    |

### SD-02 | Require a postal code at checkout

**High priority · Negative and empty-field boundary · Automated** · [Playwright spec](../tests/checkout.spec.ts)

#### Preconditions

- An active internet connection is available.
- Open SauceDemo in a fresh Google Chrome session and complete the [shared checkout setup](#shared-checkout-setup-for-sd-01-and-sd-02).
- `Checkout: Your Information` is open and the postal code field is empty.

#### Steps and expected results

| #   | Step                                                                         | Expected Result                                                                           |
| --- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 1   | Enter `Ada` and `Tester`, leave the postal code empty, and click `Continue`. | The app stays on `Checkout: Your Information` and shows `Error: Postal Code is required`. |
| 2   | Enter `12345` as the postal code and click `Continue`.                       | `Checkout: Overview` opens.                                                               |

### SD-03 | Reject a locked demo account

**High priority · Negative · Automated** · [Playwright spec](../tests/login.spec.ts)

#### Preconditions

- An active internet connection is available.
- Open the SauceDemo login page in a fresh Google Chrome session.
- The `locked_out_user` account is available in the [demo accounts](../resources/data/users.json).

#### Steps and expected results

| #   | Step                                                         | Expected Result                                                                                |
| --- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| 1   | Enter the locked demo account credentials and click `Login`. | The login form remains visible and shows `Epic sadface: Sorry, this user has been locked out.` |

### SD-04 | Remove the last cart item

**Medium priority · Boundary · Automated** · [Playwright spec](../tests/cart.spec.ts)

#### Preconditions

- An active internet connection is available.
- Open the SauceDemo login page in a fresh Google Chrome session with an empty cart.
- The standard demo account and `Sauce Labs Backpack` are available for this case.

#### Steps and expected results

| #   | Step                                                                                  | Expected Result                                                           |
| --- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 1   | Sign in with the standard demo account, add `Sauce Labs Backpack`, and open the cart. | `Your Cart` shows one row for the backpack and a badge count of `1`.      |
| 2   | Click `Remove` for the backpack.                                                      | `Your Cart` stays open with zero product rows. The cart badge disappears. |
