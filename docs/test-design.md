# SauceDemo test design

## Feature coverage and rationale

The assessment covers the desktop shopping flow from account sign-in and product selection through cart changes and simulated checkout. [Sauce Labs sample application](https://github.com/saucelabs/sample-app-web)

- **Checkout (SD-01 and SD-02).** Automate the purchase path because a shopper must be able to place an order. Verify the selected item and subtotal at review. Use the empty postal code boundary to check that validation blocks review and lets the shopper continue after correcting the input.
- **Sign-in (SD-03).** Verify that a locked account stays on the sign-in form and sees a clear reason why sign-in was blocked.
- **Cart (SD-04).** Check the one-to-zero item boundary because the cart must update its contents and count together.

## Strategy

Run all four [automated cases](../tests/) in Chrome and Firefox. Each test starts in a fresh browser context so session and cart state stay isolated during parallel runs. Shared Steps handle sign-in, cart setup and checkout form submission. Web-first assertions check shopper-visible results at each state change, and HTML reports retain steps and failure evidence.

## Test cases

Start each case from the [demo URL](../resources/data/environment.json) in a fresh session. Use the [demo accounts](../resources/data/users.json) and [checkout data](../resources/data/checkout.json).

### Shared checkout setup for SD-01 and SD-02

1. Sign in with the standard demo account. Expect the `Products` screen.
2. Add the product from the checkout data and open the cart. Expect `Your Cart` to show the selected product.
3. Click `Checkout`. Expect `Checkout: Your Information`.

### SD-01 | Place a one-item order

**High priority · Positive · Automated**

1. Enter the first name, last name and postal code from the checkout data. Click `Continue`. Expect `Checkout: Overview`.
2. Verify that the overview shows the selected product and the expected item subtotal from the checkout data.
3. Click `Finish`. Expect `Checkout: Complete!` and `Thank you for your order!`.

### SD-02 | Require a postal code at checkout

**High priority · Negative and empty-field boundary · Automated**

1. Enter the first and last name from the checkout data, leave the postal code empty and click `Continue`.
2. Expect `Error: Postal Code is required` and the `Checkout: Your Information` screen to remain visible.
3. Enter the valid postal code from the checkout data and click `Continue`. Expect `Checkout: Overview`.

### SD-03 | Reject a locked demo account

**High priority · Negative · Automated**

1. Enter the locked demo account credentials and click `Login`.
2. Expect the login form to remain visible with the error `Epic sadface: Sorry, this user has been locked out.`.

### SD-04 | Remove the last cart item

**Medium priority · Boundary · Automated**

1. Sign in as the standard user, add the product from the checkout data and open the cart. Expect `Your Cart` to show one row for the product and a badge count of `1`.
2. Click `Remove` for the product. Expect `Your Cart` to remain visible with zero cart rows and no cart badge.
