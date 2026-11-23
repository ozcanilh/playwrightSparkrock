---
name: playwright-pom
description: Add or maintain Playwright TypeScript UI cases, Page Objects, reusable Steps, fixtures and JSON test data.
---

# Playwright Page Objects

1. Read the [Page Object rules](../../rules/page-objects.md) and [test and wait rules](../../rules/playwright-tests.md). Match the case ID and expected outcome to `docs/test-design.md`.
2. Inspect the live DOM for new selectors or the trace for failed actions. Put fixed locators in the Page Object constructor and reuse Steps, fixtures, and JSON inputs.
3. Run the affected case in Chrome and Firefox with `npm test -- --grep "CASE-ID"`, substituting its ID. Run `npm test` when the change affects shared behavior. Check with `npm run typecheck` and `npm run format:check`.
