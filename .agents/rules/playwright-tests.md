# Playwright tests and waits

## Testing behavior

- Match the `SD-XX` ID, steps, and business assertions to the [test design](../../docs/test-design.md). Use named `test.step` blocks for meaningful transitions.
- Use a fresh browser context per test. Keep scenario inputs in `resources/data/` and write assertions against visible application outcomes, such as the expected screen, message, or item count.

## Waits and timeouts

- Use Playwright actionability checks and retrying assertions such as `toBeVisible`, `toHaveText`, and `toHaveURL`. For an event the case depends on, start waiting for that event before triggering the action.
- Keep fixed sleeps out of tests and helpers, including `page.waitForTimeout()` and timer-based delays. Page reloads belong to scenarios that explicitly exercise a reload.
- Treat [playwright.config.ts](../../playwright.config.ts) as the source for the test, assertion, action, and navigation timeouts. On a timeout, inspect the trace, locator match, and expected state first. If the correct behavior needs a longer budget, scope the override to the affected operation and record the reason. Preserve the expected outcome and any product deadline.
