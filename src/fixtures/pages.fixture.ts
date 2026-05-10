import { test as base } from '@playwright/test';
import { HomePage, ProductsPage, ProductDetailsPage, CartPage, CategoryPage } from '../pages';

/**
 * Page object fixtures.
 *
 * Extending Playwright's `base` test with these fixtures gives every spec a
 * ready-to-use, lazily-instantiated page object so specs stay focused on
 * intent rather than wiring.
 */
export interface PageFixtures {
  homePage: HomePage;
  productsPage: ProductsPage;
  productDetailsPage: ProductDetailsPage;
  cartPage: CartPage;
  categoryPage: CategoryPage;
}

export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },

  productDetailsPage: async ({ page }, use) => {
    await use(new ProductDetailsPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  categoryPage: async ({ page }, use) => {
    await use(new CategoryPage(page));
  },
});

export { expect } from '@playwright/test';
