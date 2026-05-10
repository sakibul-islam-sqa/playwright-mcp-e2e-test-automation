# Playwright MCP E2E Test Automation Framework

A **production-grade End-to-End (E2E) test automation framework** built with [Playwright](https://playwright.dev/) and TypeScript, designed to work seamlessly with [Playwright MCP (Model Context Protocol)](https://github.com/microsoft/playwright-mcp) for AI-assisted test execution and authoring.

This framework demonstrates industry best practices including the **Page Object Model**, **fixtures**, **structured logging**, **Chromium as the default browser** with optional Firefox, WebKit, and mobile projects, **CI/CD integration**, and **rich reporting**, all targeted at the [automationexercise.com](http://automationexercise.com) demo application.

---

## Table of Contents

1. [Highlights](#highlights)
2. [Project Structure](#project-structure)
3. [Test Cases Implemented](#test-cases-implemented)
4. [Tech Stack](#tech-stack)
5. [Prerequisites](#prerequisites)
6. [Quick Start](#quick-start)
7. [Running the Tests](#running-the-tests)
8. [Configuration](#configuration)
9. [Reporting & Artifacts](#reporting--artifacts)
10. [Page Object Model](#page-object-model)
11. [Working with Playwright MCP](#working-with-playwright-mcp)
12. [Continuous Integration](#continuous-integration)
13. [Code Quality](#code-quality)
14. [Troubleshooting](#troubleshooting)
15. [Best Practices Applied](#best-practices-applied)
16. [Contributing](#contributing)

---

## Highlights

- **TypeScript-first** with strict type checking and path aliases.
- **Page Object Model** with a shared `BasePage` for reuse and DRY testing.
- **Custom Playwright fixtures** that inject ready-to-use page objects into every test.
- **Chromium by default**: `npm test` runs the **`chromium`** project (Desktop Chrome profile). Run **`npm run test:all`** or **`--project=firefox`** / **`webkit`** / mobile when you need cross-browser coverage.
- **Sharded, parallel execution** with deterministic retries on CI.
- **Multiple reporters**: HTML, list, JSON, JUnit, and GitHub annotations on CI.
- **Trace, screenshot, and video** capture on failure for fast debugging.
- **Centralized configuration** through `.env` files and a typed `config` module.
- **Structured logging** with timestamped, level-aware output.
- **GitHub Actions workflow** with matrix sharding and report aggregation.
- **Playwright MCP–ready**: a sample `mcp.config.example.json` demonstrates how to wire AI assistants into the same test surface.
- **Quality tooling preconfigured**: ESLint, Prettier, TypeScript strict mode.

---

## Project Structure

```text
playwright-mcp-e2e-test-automation/
├── .github/
│   └── workflows/
│       └── playwright.yml            # GitHub Actions CI/CD pipeline
├── .vscode/
│   ├── extensions.json               # Recommended editor extensions
│   └── settings.json.example         # Sample editor settings
├── src/
│   ├── config/
│   │   ├── environment.ts            # Typed env var loader
│   │   └── urls.ts                   # Centralized URL paths
│   ├── data/
│   │   └── test-data.ts              # Shared test data and constants
│   ├── fixtures/
│   │   ├── index.ts                  # Public fixture exports
│   │   └── pages.fixture.ts          # Custom Playwright fixtures
│   ├── pages/                        # Page Object Model
│   │   ├── BasePage.ts
│   │   ├── HomePage.ts
│   │   ├── ProductsPage.ts
│   │   ├── ProductDetailsPage.ts
│   │   ├── CartPage.ts
│   │   ├── CategoryPage.ts
│   │   └── index.ts
│   └── utils/
│       ├── helpers.ts                # Reusable helpers (overlays, parsing, scrolling)
│       └── logger.ts                 # Structured logger
├── tests/
│   └── e2e/
│       ├── search-product.spec.ts                    # TC1
│       ├── add-products-to-cart.spec.ts              # TC2
│       ├── verify-product-quantity-in-cart.spec.ts   # TC3
│       ├── remove-products-from-cart.spec.ts         # TC4
│       └── view-category-products.spec.ts            # TC5
├── .env.example
├── .eslintrc.js
├── .gitignore
├── .prettierignore
├── .prettierrc.json
├── global-setup.ts                   # Runs once before all tests
├── global-teardown.ts                # Runs once after all tests
├── mcp.config.example.json           # Playwright MCP integration example
├── package.json
├── playwright.config.ts              # Main Playwright configuration
├── README.md
└── tsconfig.json
```

---

## Test Cases Implemented

This framework automates the following five end-to-end scenarios on [automationexercise.com](http://automationexercise.com):

| #   | Test Case                       | Spec File                                 | Tags                 |
| --- | ------------------------------- | ----------------------------------------- | -------------------- |
| TC1 | Search Product                  | `search-product.spec.ts`                  | `@smoke @regression` |
| TC2 | Add Products in Cart            | `add-products-to-cart.spec.ts`            | `@smoke @regression` |
| TC3 | Verify Product Quantity in Cart | `verify-product-quantity-in-cart.spec.ts` | `@smoke @regression` |
| TC4 | Remove Products From Cart       | `remove-products-from-cart.spec.ts`       | `@smoke @regression` |
| TC5 | View Category Products          | `view-category-products.spec.ts`          | `@smoke @regression` |

### TC1 – Search Product

1. Launch browser
2. Navigate to `http://automationexercise.com`
3. Verify the home page is visible
4. Click the **Products** button
5. Verify navigation to **ALL PRODUCTS** page
6. Enter a product name in the search input and click the search button
7. Verify **SEARCHED PRODUCTS** heading is visible
8. Verify all results match the search term

### TC2 – Add Products in Cart

1. Launch browser
2. Navigate to `http://automationexercise.com`
3. Verify the home page is visible
4. Click **Products**
5. Hover the first product and click **Add to cart**
6. Click **Continue Shopping**
7. Hover the second product and click **Add to cart**
8. Click **View Cart**
9. Verify both products appear in the cart
10. Verify each product's price, quantity, and total

### TC3 – Verify Product Quantity in Cart

1. Launch browser
2. Navigate to `http://automationexercise.com`
3. Verify the home page is visible
4. Click **View Product** for any product on the home page
5. Verify the product details page is opened
6. Increase quantity to **4**
7. Click **Add to cart**
8. Click **View Cart**
9. Verify the product appears in the cart with the exact quantity

### TC4 – Remove Products From Cart

1. Launch browser
2. Navigate to `http://automationexercise.com`
3. Verify the home page is visible
4. Add products to cart
5. Click the **Cart** button
6. Verify the cart page is displayed
7. Click the **X** button next to a particular product
8. Verify the product is removed from the cart

### TC5 – View Category Products

1. Launch browser
2. Navigate to `http://automationexercise.com`
3. Verify categories are visible on the left sidebar
4. Click the **Women** category
5. Click any sub-category (e.g. **Tops**)
6. Verify the category page shows **WOMEN - TOPS PRODUCTS**
7. On the sidebar, click any sub-category of **Men**
8. Verify navigation to that category page

---

## Tech Stack

| Layer                 | Technology                                                 |
| --------------------- | ---------------------------------------------------------- |
| Test runner & browser | [Playwright Test](https://playwright.dev/) v1.48           |
| Language              | TypeScript 5.6                                             |
| Runtime               | Node.js 18+ (recommended Node.js 20)                       |
| Linting               | ESLint + `@typescript-eslint` + `eslint-plugin-playwright` |
| Formatting            | Prettier                                                   |
| Reporting             | HTML / List / JSON / JUnit / GitHub                        |
| CI/CD                 | GitHub Actions                                             |
| AI Integration        | Playwright MCP (Model Context Protocol)                    |

---

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** `>=18.0.0` (recommended 20 LTS) — [download](https://nodejs.org/)
- **npm** `>=9.0.0` (ships with Node)
- **Git**
- A modern terminal and code editor (VS Code recommended)

> After `npm install`, the **`prepare`** script installs **Chromium** only. To run against Firefox, WebKit, or mobile projects, run **`npm run install:browsers`** once (installs all Playwright browsers).

---

## Quick Start

```bash
git clone https://github.com/sakibul-islam-sqa/playwright-mcp-e2e-test-automation.git
cd playwright-mcp-e2e-test-automation

npm install

cp .env.example .env

npm test
```

Optional — install every browser, then run the full matrix locally:

```bash
npm run install:browsers
npm run test:all
```

To watch tests run interactively:

```bash
npm run test:ui
```

To open the last HTML report:

```bash
npm run report
```

---

## Running the Tests

The `package.json` exposes a rich set of scripts:

### Default (Chromium only)

```bash
npm test                     # `--project=chromium` (Desktop Chrome profile)
npm run test:headed          # Chromium, headed mode
npm run test:debug           # Chromium, debug
npm run test:ui              # Chromium, UI mode
npm run test:chromium        # Same as `npm test`
```

### Headed mode (visible browser)

```bash
npm run test:headed          # Chromium, headed
npm run test:all:headed      # All projects, headed
npm run test:smoke:headed    # Chromium smoke suite, headed
npm run test:firefox:headed
npm run test:webkit:headed
npm run test:mobile:headed
```

### All browsers / pick a browser

```bash
npm run test:all             # Every project in playwright.config (Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari)
npm run test:firefox         # Desktop Firefox
npm run test:webkit          # Desktop WebKit (Safari engine)
npm run test:mobile          # Mobile Chrome + Mobile Safari device profiles
```

Use Playwright’s CLI for combinations, for example:

```bash
npx playwright test --project=firefox --project=webkit
```

### By tag

```bash
npm run test:smoke           # Tests tagged @smoke
npm run test:regression      # Tests tagged @regression
```

### By feature

```bash
npm run test:search           # TC1
npm run test:search:headed    # TC1, headed
npm run test:cart             # TC2 + TC3 + TC4
npm run test:cart:headed      # TC2 + TC3 + TC4, headed
npm run test:category         # TC5
npm run test:category:headed  # TC5, headed
```

### By worker count

```bash
npm run test:parallel        # 4 workers
npm run test:serial          # 1 worker (debug-friendly)
```

### Directly with Playwright

```bash
npx playwright test tests/e2e/search-product.spec.ts --project=chromium
npx playwright test --project=chromium --grep "@smoke"
npx playwright test --project=firefox tests/e2e/search-product.spec.ts
npx playwright test --headed --workers=1 --retries=0 --project=chromium
```

### Generate locators

```bash
npm run codegen
```

---

## Configuration

### Environment variables

All runtime knobs are loaded from `.env` (copy from `.env.example`):

| Variable             | Default                         | Purpose                             |
| -------------------- | ------------------------------- | ----------------------------------- |
| `BASE_URL`           | `http://automationexercise.com` | Application under test              |
| `CI`                 | `false`                         | Toggles CI-friendly behaviour       |
| `HEADLESS`           | `true`                          | Run browsers headless               |
| `SLOW_MO`            | `0`                             | Slow each Playwright action by N ms |
| `DEFAULT_TIMEOUT`    | `60000`                         | Per-test timeout in ms              |
| `ACTION_TIMEOUT`     | `15000`                         | Per-action timeout in ms            |
| `NAVIGATION_TIMEOUT` | `30000`                         | Per-navigation timeout in ms        |
| `LOG_LEVEL`          | `info`                          | `debug` / `info` / `warn` / `error` |
| `ENV`                | `local`                         | Logical environment label           |

### Playwright config

`playwright.config.ts` controls:

- Test directory and output directory
- Global setup/teardown hooks
- Per-test, per-action, per-navigation, and per-assertion timeouts
- Retries (1 locally, 2 on CI), parallel workers, and `forbidOnly` on CI
- Reporters (HTML, list, JSON, JUnit, GitHub on CI)
- Tracing, screenshot, and video policies (`retain-on-failure`)
- Five browser projects: **chromium** (default via npm scripts), **firefox**, **webkit**, **Mobile Chrome**, **Mobile Safari**. Plain `npx playwright test` runs **all** projects; **`npm test`** pins **`--project=chromium`**.

---

## Reporting & Artifacts

After every run the framework produces:

- **HTML report** — `playwright-report/` (auto-opens locally on failure)
- **JSON results** — `test-results/results.json`
- **JUnit XML** — `test-results/results.xml` (consumable by CI dashboards)
- **Trace files** — `test-results/**/trace.zip` (for failed tests, replay with `npx playwright show-trace`)
- **Screenshots** — captured on failure
- **Videos** — captured on failure

Open the latest HTML report:

```bash
npm run report
```

Open a trace file:

```bash
npx playwright show-trace test-results/<spec>/trace.zip
```

---

## Page Object Model

Each application screen has a dedicated page object that encapsulates locators and high-level actions. Tests then read like product specs:

```typescript
test('should add two products to the cart and verify totals', async ({
  homePage,
  productsPage,
  cartPage,
}) => {
  await homePage.open();
  await homePage.verifyHomePageIsVisible();
  await homePage.clickProducts();
  await productsPage.verifyAllProductsPageIsLoaded();
  await productsPage.addProductToCartByIndex(0);
  await productsPage.clickContinueShopping();
  await productsPage.addProductToCartByIndex(1);
  await productsPage.clickViewCartFromModal();
  await cartPage.verifyCartHasItemsCount(2);
});
```

| Page Object          | Responsibility                                                   |
| -------------------- | ---------------------------------------------------------------- |
| `BasePage`           | Common navigation, assertions, safe-click, overlay dismissal     |
| `HomePage`           | Header navigation, hero slider, sidebar categories, view-product |
| `ProductsPage`       | All Products grid, search, hover-add-to-cart, cart modal         |
| `ProductDetailsPage` | Product information, quantity selector, add-to-cart              |
| `CartPage`           | Cart line items, totals, removal of products                     |
| `CategoryPage`       | Category-filtered listing pages and category headings            |

The `pages.fixture.ts` extends Playwright's `test` to inject these page objects:

```typescript
import { test, expect } from '../../src/fixtures';

test('example', async ({ homePage, cartPage }) => {
  await homePage.open();
});
```

---

## Working with Playwright MCP

[Playwright MCP](https://github.com/microsoft/playwright-mcp) exposes Playwright as a Model Context Protocol server, allowing AI assistants (Cursor, Claude Desktop, VS Code Copilot, etc.) to drive a real browser, inspect the DOM, and assist with test creation or live debugging.

### Mental Model

This repository contains **two completely separate execution paths** that share the same code in `src/pages/` and `tests/e2e/`:

| Layer                                   | What it is                        | When it runs                                   |
| --------------------------------------- | --------------------------------- | ---------------------------------------------- |
| **Test framework** (`@playwright/test`) | Production E2E suite              | CI/CD, scheduled runs, local `npm test`        |
| **Playwright MCP** (`@playwright/mcp`)  | AI-assistance bridge for your IDE | Only when you collaborate with an AI assistant |

> **Important:** Playwright MCP is **not** required to run the tests. `npm test` ignores MCP entirely and uses the standard Playwright runner. MCP is an **optional companion** that lets AI assistants drive a real browser while you author or debug tests.

```text
┌─────────────────────────────────────────────────────────┐
│   CI / Local Test Runs                                  │
│   ┌───────────────────────────────────────────────┐     │
│   │  npm test  →  @playwright/test  →  Browser    │     │
│   └───────────────────────────────────────────────┘     │
│            (MCP not involved at all)                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│   Authoring / Debugging in Your Editor                  │
│   ┌──────────┐  MCP  ┌──────────────────┐  CDP          │
│   │  Cursor  │ ────► │ @playwright/mcp  │ ───► Browser  │
│   │  / Claude│       │     (server)     │               │
│   └──────────┘       └──────────────────┘               │
│        │                                                │
│        └─► reads & edits ──► src/pages, tests/e2e       │
└─────────────────────────────────────────────────────────┘
```

The same code is consumed by both paths — that's the whole point. You write the tests once; you can run them traditionally _and_ let an AI maintain them via MCP.

### Why the Project Was Built MCP-Friendly

Every design choice in this framework supports AI-assisted maintenance:

| Design choice                                                        | Why it helps AI + MCP                                                   |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Page Object Model** with named methods (`verifyHomePageIsVisible`) | AI can read intent and update implementations without rewriting specs   |
| **Centralized selectors** in page object constructors                | AI updates one location, not 20                                         |
| **`test.step()` blocks** mirroring the test case steps               | AI can map a failing step directly to a single page object call         |
| **Structured logger** (`logger.step()`)                              | When AI runs a test through MCP, it sees the same human-readable output |
| **Fixtures inject page objects**                                     | AI can write new specs without learning the DI plumbing                 |
| **`safeClick` + overlay dismissal**                                  | Resolves the most common class of issue MCP-driven exploration reveals  |

### Practical Usage Workflows

Here's where the value shows up day-to-day:

1. **Authoring new page objects / specs** — ask the AI to open the site via MCP, hover over an element, and report the most stable selector. The AI then updates the corresponding page object with a verified selector.
2. **Debugging a flaky test** — point the AI at a failing test; it reproduces the flow through MCP, identifies the root cause (e.g. an ad iframe intercepting clicks), and proposes a fix in `BasePage.safeClick()` or the relevant page object.
3. **Maintaining tests after UI changes** — ask the AI to compare the current DOM against the locators in `src/pages/` and report stale selectors before they break the suite.
4. **Exploratory test discovery** — let the AI browse a section of the app and suggest edge-case tests grounded in real observations.

### 1. Install the MCP server

```bash
npx @playwright/mcp@latest --help
```

### 2. Configure your MCP client

Copy the bundled example config and adapt it to your client:

```bash
cp mcp.config.example.json mcp.config.json
```

Example config (`mcp.config.example.json`):

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    },
    "playwright-headless": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest", "--headless", "--browser=chromium", "--isolated"]
    }
  }
}
```

For **Cursor**, add this snippet to `~/.cursor/mcp.json`. For **Claude Desktop**, add it to `claude_desktop_config.json`. For **VS Code Copilot Chat**, configure it under MCP servers in settings.

### 3. Drive tests with AI

Once the MCP server is connected, you can ask your AI assistant to:

- Run any spec in this repo (`npm run test:smoke`).
- Inspect a flaky locator and propose a fix in the relevant page object.
- Generate new tests under `tests/e2e/` that follow the existing fixture pattern.
- Walk through `automationexercise.com` and produce updated Page Object methods.

The framework is intentionally structured so that AI-generated changes are easy to review: page objects expose well-named, intent-revealing helpers, and specs are short and declarative.

---

## Continuous Integration

A complete GitHub Actions workflow lives at `.github/workflows/playwright.yml`. On every push or pull request to `main` / `master` / `develop`, it will:

1. Lint the codebase (`eslint`, `prettier --check`, `tsc --noEmit`).
2. Run the full E2E suite as a **1 × 2 matrix** (Chromium × 2 shards) for parallel feedback on push/PR.
3. Cache Playwright browser binaries between runs.
4. Upload HTML reports, JUnit XML, traces, and screenshots as workflow artifacts.
5. Aggregate shard reports into a single combined artifact.

**Manual runs** (`workflow_dispatch`): use the **browser** dropdown (Chromium, Firefox, WebKit, **mobile** = Mobile Chrome + Mobile Safari, or **all** projects) plus an optional **tag** filter. Manual runs use a separate job and do not merge into the aggregated report artifact (each run uploads its own `playwright-report-manual-*` artifact).

### Triggering manually

```bash
gh workflow run playwright.yml -f browser=chromium -f tag="@smoke"
gh workflow run playwright.yml -f browser=firefox
gh workflow run playwright.yml -f browser=all
```

---

## Code Quality

Run the quality gates locally before opening a pull request:

```bash
npm run lint          # ESLint with the Playwright plugin
npm run lint:fix      # Auto-fix lint issues
npm run format        # Prettier write
npm run format:check  # Prettier verify (CI)
npm run type-check    # tsc --noEmit
```

Recommended editor extensions are listed in `.vscode/extensions.json`.

---

## Troubleshooting

| Symptom                                                         | Likely cause / fix                                                                                 |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `Executable doesn't exist at /…/chromium` (or firefox / webkit) | Run `npm run install:browsers` or `npx playwright install <browser> --with-deps`.                  |
| Tests hang on `automationexercise.com`                          | Third-party ads occasionally block clicks. The `BasePage.dismissOverlays()` helper mitigates this. |
| `expect(...).toContainText` flakiness                           | Increase `actionTimeout` in `playwright.config.ts`, or rerun with `--retries=2`.                   |
| GitHub Actions `act lint` step fails on Windows EOL             | Configure Git with `git config --global core.autocrlf input`. Prettier enforces `lf`.              |
| Playwright report doesn't open                                  | Pass `--reporter=html` or run `npx playwright show-report`.                                        |
| MCP server can't launch a browser                               | Ensure `--with-deps` was run; on Linux some extra apt packages may be required.                    |

If a test fails, inspect the trace:

```bash
npx playwright show-trace test-results/<test-name>/trace.zip
```

---

## Best Practices Applied

- **Single source of truth for selectors** — all locators live inside page objects, never inside specs.
- **Stable selectors** — prefer semantic locators (`#search_product`, `:has-text(...)`) over brittle CSS chains.
- **Auto-waiting** — rely on Playwright's built-in waiting, with explicit `waitFor` only when necessary.
- **Resilient interactions** — `safeClick` retries with `force: true` after dismissing third-party overlays.
- **Deterministic test data** — central constants in `src/data/test-data.ts`.
- **Strict TypeScript** — exhaustive types for fixtures, page objects, and config.
- **Layered timeouts** — separate per-test, per-action, per-navigation, and per-assertion timeouts.
- **Trace-on-failure** — failures produce traces, screenshots, and videos automatically.
- **Tags drive scope** — `@smoke`, `@regression` allow surgical CI runs.
- **CI parallelism** — sharded matrix runs the full suite in minutes.

---

## Contributing

1. Fork [the repository](https://github.com/sakibul-islam-sqa/playwright-mcp-e2e-test-automation) and create a feature branch (`git checkout -b feature/my-test`).
2. Run the existing suite locally to make sure the baseline is green.
3. Add or update page objects and specs following the patterns documented above.
4. Run `npm run lint` and `npm run format` before committing.
5. Open a pull request describing the change and link to any related issue.

Useful commands while contributing:

```bash
npm run codegen                       # Record interactions to draft new tests
npx playwright test --debug           # Step through a failing test
npx playwright show-trace …trace.zip  # Inspect a captured trace
```

---

## Acknowledgements

- [Playwright](https://playwright.dev/) and the Microsoft Playwright team
- [Playwright MCP](https://github.com/microsoft/playwright-mcp)
- [Automation Exercise](http://automationexercise.com) for the open practice site
- The broader open-source testing community

---

> Built with care to demonstrate professional, maintainable, and scalable Playwright automation that pairs seamlessly with the Model Context Protocol.
