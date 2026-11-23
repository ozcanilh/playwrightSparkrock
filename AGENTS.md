# Working agreements

- Keep locators and individual UI actions in `pages/`, reusable workflows in `steps/`, and case IDs and business assertions in `tests/`.
- Extend `BasePage` in each Page Object. Declare fixed selectors as `readonly Locator` fields and initialize them in the constructor after `super(page)`.
- Register Page Objects and Steps in `fixtures/pomFixtures.ts` for each test. Use web-first assertions and independent browser contexts for parallel runs.
- Keep the base URL, public demo credentials and synthetic inputs in `resources/data/`. Update [the test design](docs/test-design.md) when coverage or expected behavior changes.
- For UI automation, follow the [Page Object and locator rules](.agents/rules/page-objects.md) and the [test and wait rules](.agents/rules/playwright-tests.md). Use the [playwright-pom skill](.agents/skills/playwright-pom/SKILL.md) for implementation and verification.
