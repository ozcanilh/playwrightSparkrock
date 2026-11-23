# Sparkrock Senior QA Engineer Challenge

Playwright and TypeScript UI automation for SauceDemo sign-in, cart and checkout. Start with the commands below or review the [written test design](docs/test-design.md) for all four automated cases.

## Quick start

### Open SauceDemo

Open [SauceDemo](https://www.saucedemo.com/) and sign in with the public demo username `standard_user` and password `secret_sauce`. Sauce Labs keeps the demo running online. The test suite opens that hosted page automatically using the URL in [environment.json](resources/data/environment.json).

### Set up and run the automation

Clone the repository and open a terminal in its root. Use Node.js 24 LTS and have [Google Chrome](https://www.google.com/chrome/) installed. If you use nvm, run `nvm install` and `nvm use` to select the version in [`.nvmrc`](.nvmrc).

```sh
node --version                  # Expect v24.x
npm ci                          # Install the locked dependencies and Git hook
npx playwright install firefox  # Install Playwright's Firefox build
npm test                        # Run all four cases in both browsers
```

On Linux, use `npx playwright install --with-deps firefox` to install Firefox and its system dependencies. A full run produces eight results, one per case in each browser.

## Run a single case or a subset

Case IDs are part of the test titles, so `--grep` selects the case. Add `--project` to select a single browser.

```sh
npm test -- --grep "SD-01"                         # One case in both browsers
npm test -- --grep "SD-02" --project=firefox        # One case in Firefox
npm test -- --grep "SD-03"                         # Locked account
npm test -- --grep "SD-04"                         # Remove the last cart item
npm test -- --grep "SD-01" --project=chrome --headed # One case with Chrome visible
npm test -- tests/checkout.spec.ts                  # Every case in this spec
npm test -- --project=chrome                       # All cases in Chrome
npm test -- --project=firefox                      # All cases in Firefox
```

For interactive debugging, use `npm test -- --ui` to choose and inspect a case, or `npm test -- --grep "SD-02" --project=chrome --debug` to step through the validation case in Playwright Inspector.

## Reports and failure diagnosis

```sh
npm run report:playwright       # Open the latest Playwright HTML report
npm run report:allure:generate  # Convert the latest Allure results to HTML
npm run report:allure:open      # Open the generated Allure HTML report
```

Run the report viewers in separate terminals. **Playwright HTML** groups results by test and browser and gives you direct access to failed assertions, screenshots and traces in `playwright-report/`. **Allure** gives reviewers a second view with an outcome summary, named steps and attachments in `allure-report/`. Raw Allure results in `allure-results/` are reset by `npm test` so the generated report reflects the latest run.

On failure, open the trace from the Playwright report or run `npx playwright show-trace "path/to/trace.zip"` with the trace from the relevant directory in `test-results/`. Use the trace to inspect actions, DOM snapshots and network activity around the failure.

The Playwright config sets separate timeouts for tests, assertions, actions and navigation. Use the trace to identify which operation exceeded its limit before changing the timeout. [Timeout settings](playwright.config.ts) · [Wait rules](.agents/rules/playwright-tests.md)

## Test design and coverage

SauceDemo provides known accounts and a simulated purchase flow that a reviewer can repeat. The [test design](docs/test-design.md) describes the scope, priorities, strategy, data, steps and expected outcomes.

| Case  | Behavior                                                                    | Execution |
| ----- | --------------------------------------------------------------------------- | --------- |
| SD-01 | Complete a one-item order and verify the subtotal and confirmation.         | Automated |
| SD-02 | Block checkout when the postal code is empty and continue after correction. | Automated |
| SD-03 | Show the locked-account error and keep the shopper on the sign-in page.     | Automated |
| SD-04 | Remove the last cart item and clear the cart badge.                         | Automated |

## Assessment criteria

### Test Design

#### Completeness

The design covers the critical desktop shopping path in scope, from sign-in and product selection to cart updates, checkout validation and order confirmation. It explains the risk addressed by each case. [Feature coverage and rationale](docs/test-design.md#feature-coverage-and-rationale)

#### Relevance

Each case checks an outcome a shopper would notice. An order review must show the right item and subtotal, checkout must require a postal code, a locked account must receive a clear message, and removing the last item must update the cart count. [Risk and case rationale](docs/test-design.md#feature-coverage-and-rationale)

#### Innovation and Efficiency

- **GitHub Actions integration.** The workflow checks formatting and TypeScript, runs the browser tests and packages both reports on pushes to `main`, pull requests and manual runs. A daily Chrome run at 09:00 Istanbul time checks the hosted storefront between code changes. [CI workflow](.github/workflows/playwright.yml)
- **Parallel execution.** Playwright uses two workers and gives each test a fresh browser context. Tests can reuse the public demo accounts while keeping session and cart state isolated. The same spec runs in both browsers, giving cross-browser coverage from a single implementation. [Playwright configuration](playwright.config.ts) · [Test strategy](docs/test-design.md#strategy)
- **Reusable POM and data.** Page Objects keep selectors and UI actions in one place. Shopping and Checkout Steps share repeated workflows across cases. Typed fixtures construct these objects for each test, and JSON resources provide consistent inputs. A selector change can be made in the Page Object that owns it. [Page Objects](pages/) · [Steps](steps/) · [Fixtures](fixtures/pomFixtures.ts) · [Test data](resources/data/)
- **Early formatting feedback.** Husky invokes lint-staged to run Prettier on staged files. This keeps the pre-commit check focused on the files being committed. CI checks formatting across the project and runs TypeScript validation before opening a browser. [Pre-commit hook](.husky/pre-commit) · [npm configuration](package.json) · [CI workflow](.github/workflows/playwright.yml)
- **Two reports from one run.** Playwright HTML gives reviewers named steps, failed assertions and trace links. Allure provides a result summary with step details and attachments. The workflow packages both HTML reports per browser when available, and failure screenshots and traces help diagnose issues from the recorded run. [Report commands](#reports-and-failure-diagnosis) · [Report artifacts](.github/workflows/playwright.yml)
- **Slack report delivery.** Once enabled, a single channel message gives the team the result, browsers, and direct download links for the Playwright and Allure report bundles. The message links to the exact workflow run for failure diagnosis. [Slack setup](docs/slack-setup.md)
- **Consistent test maintenance.** The project QA agent, POM skill and selector and wait rules give contributors a repeatable process for implementing a documented case, diagnosing failures and verifying changes in both browsers. [Agent setup](#agent-setup)

### Test Case Writing

#### Clarity and Structure

Each case has an ID, priority, scenario type, numbered actions and observable expected results. Shared setup and linked JSON inputs make the steps reproducible. [Written cases](docs/test-design.md#test-cases)

#### Coverage and Precision

SD-01 checks the successful order and exact subtotal. SD-02 checks the missing-field error and recovery. SD-03 verifies the exact locked-account message. SD-04 verifies the one-to-zero transition for cart rows and removal of the badge. [Checkout spec](tests/checkout.spec.ts) · [Sign-in spec](tests/login.spec.ts) · [Cart spec](tests/cart.spec.ts)

### Code Quality

#### Readability and Organization

Page Objects contain named, typed locators and actions. Steps compose reusable flows, and specs group business assertions in named `test.step` blocks. Prettier applies a consistent format. [Project structure](#architecture-and-tool-choices) · [Code style](#code-style-and-git-hooks)

#### Best Practices and Scalability

Typed fixtures provide independent browser state per test. Web-first assertions, scoped timeout rules and failure traces help diagnose failures. CI checks formatting and types and runs each browser as its own job. [Fixtures](fixtures/pomFixtures.ts) · [Test and wait rules](.agents/rules/playwright-tests.md) · [Playwright configuration](playwright.config.ts) · [CI workflow](.github/workflows/playwright.yml)

## Architecture and tool choices

**Playwright Test** runs the same UI suite in Chrome and Firefox. Isolated browser contexts protect session and cart state during parallel runs, and web-first assertions wait for the expected UI state. **TypeScript** makes the interfaces between fixtures, Steps, and Page Objects explicit so type checking can catch wiring errors. [Playwright configuration](playwright.config.ts) · [TypeScript configuration](tsconfig.json)

**Page Object Model (POM)** gives each screen one place to maintain selectors and UI actions. The spec keeps the business assertions visible so the reviewer can compare them with the case design.

| Layer                               | Role in this project                                                                                                                                          |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Page Objects](pages/)              | Each extends [BasePage](pages/base.page.ts), passes the Playwright `Page` through `super(page)`, and sets fixed `readonly Locator` fields in the constructor. |
| [Steps](steps/)                     | Shopping Steps handle sign-in and cart setup. Checkout Steps handle form submission.                                                                          |
| [Fixtures](fixtures/pomFixtures.ts) | Use Playwright's `test.extend` to create the Page Objects and Steps once per test against its own `page`.                                                     |
| [JSON data](resources/data/)        | Keep the base URL, demo accounts, catalog item, expected subtotal and synthetic customer available across cases.                                              |
| [Test specs](tests/)                | Use the case IDs and named `test.step` groups to connect assertions, reports and the written design.                                                          |

## Code style and Git hooks

- **Prettier** keeps formatting consistent across TypeScript, JSON, Markdown and YAML. Run `npm run format` to apply it or `npm run format:check` to verify.
- **Husky** installs the Git pre-commit hook through `npm ci`. The hook uses **lint-staged** to run Prettier checks on staged files and catches formatting issues before the commit. [Pre-commit hook](.husky/pre-commit) · [npm scripts and lint-staged configuration](package.json)
- Run `npm run typecheck` to check the TypeScript project with `tsc --noEmit`.

## GitHub Actions CI

**GitHub Actions** runs formatting, type and browser checks in a clean environment. Pushes to `main`, pull requests and manual runs use separate Chrome and Firefox matrix jobs. The daily schedule runs all four cases in Chrome at **09:00 Europe/Istanbul** from the default branch. Each browser job uses two Playwright workers. A failed test gets one retry, and the run flags flaky results as failures. [Workflow file](.github/workflows/playwright.yml) · [GitHub schedule syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#onschedule)

1. Open **Actions → Playwright E2E** in the GitHub repository. Use **Run workflow** for a manual run once the workflow is available on the default branch. [GitHub's manual workflow guide](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow)
2. Open a run to view each browser's result. Download `reports-chrome` or `reports-firefox` under **Artifacts** for the generated Playwright and Allure HTML reports. The workflow uploads them when available and retains them for 14 days.
3. Extract the archive. Serve the reports with `npx playwright show-report path/to/playwright-report` and `npx allure open path/to/allure-report`.

## Slack notifications

Slack delivery is disabled by default. When enabled, the workflow posts one report summary to the selected channel after a push to `main`, a manual run or the daily Chrome run. Each link opens a browser-specific bundle with both HTML reports. [Slack setup](docs/slack-setup.md)

## Agent setup

- **`sparkrock_qa`** is the project-scoped Codex agent for implementing or diagnosing Playwright cases. In the project, ask Codex to use `sparkrock_qa` for a task such as diagnosing SD-02. [Agent definition](.codex/agents/sparkrock_qa.toml) · [Codex custom agents](https://learn.chatgpt.com/docs/agent-configuration/subagents#custom-agents)
- **Agent rules** cover the POM structure, selector priority and relative XPath fallback, state-based waits, and timeout diagnosis. [AGENTS.md](AGENTS.md) · [Locator rules](.agents/rules/page-objects.md) · [Test and wait rules](.agents/rules/playwright-tests.md)
- **The Playwright POM skill** gives the agent a repeatable workflow for matching a case to the design, implementing it in the right layer and verifying it in both browsers. [playwright-pom skill](.agents/skills/playwright-pom/SKILL.md)
