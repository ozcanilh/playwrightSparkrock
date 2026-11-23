# Page Objects and locators

Choose locators from the rendered DOM. Verify that an action locator matches one element in its intended scope.

1. Prefer a stable test ID or a unique, stable HTML ID. SauceDemo uses `data-test`, configured for `getByTestId()` in [Playwright](../../playwright.config.ts).
2. Use an accessible role and name or a form label. Use a stable placeholder or exact visible text when it uniquely identifies the element.
3. Use specific CSS based on a stable attribute or class. Scope it to the relevant form, product card, or cart row. Avoid generated classes and hard-coded positions.
4. Use relative XPath as a last resort. Anchor it to a known container with `xpath=.//`, and comment on why the previous options were unsuitable. For example, within a form with an unassociated label, use `form.locator('xpath=.//label[normalize-space(.)="Postal Code"]/following-sibling::input[@type="text"]')` if that relationship uniquely identifies the field.

Each Page Object extends `BasePage` and initializes fixed `readonly Locator` fields after `super(page)`. Put per-item locator logic in methods returning `Locator`. Keep individual interactions in Pages and reuse multi-action flows through Steps and the existing fixtures.
