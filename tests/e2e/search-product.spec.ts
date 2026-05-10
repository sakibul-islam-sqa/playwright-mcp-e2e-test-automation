import { test, expect } from '../../src/fixtures';
import { SearchProductData } from '../../src/data/test-data';

/**
 * Test Case 1: Search Product
 *
 * Steps covered:
 *  1. Launch browser
 *  2. Navigate to http://automationexercise.com
 *  3. Verify that home page is visible successfully
 *  4. Click on 'Products' button
 *  5. Verify user is navigated to ALL PRODUCTS page successfully
 *  6. Enter product name in search input and click search button
 *  7. Verify 'SEARCHED PRODUCTS' is visible
 *  8. Verify all the products related to search are visible
 */
test.describe('TC1 - Search Product @smoke @regression', () => {
  test('should search for a product and display all matching results', async ({
    homePage,
    productsPage,
  }) => {
    const searchTerm = SearchProductData.defaultSearchTerm;

    await test.step('Launch browser and navigate to automationexercise.com', async () => {
      await homePage.open();
    });

    await test.step('Verify that home page is visible successfully', async () => {
      await homePage.verifyHomePageIsVisible();
    });

    await test.step('Click on the Products button', async () => {
      await homePage.clickProducts();
    });

    await test.step('Verify navigation to ALL PRODUCTS page', async () => {
      await productsPage.verifyAllProductsPageIsLoaded();
    });

    await test.step(`Enter "${searchTerm}" into search and submit`, async () => {
      await productsPage.searchProduct(searchTerm);
    });

    await test.step('Verify SEARCHED PRODUCTS heading is visible', async () => {
      await productsPage.verifySearchedProductsHeadingVisible();
    });

    await test.step('Verify all returned products relate to the search term', async () => {
      await productsPage.verifyAllSearchedProductsAreVisible();
      await productsPage.verifySearchResultsContainTerm(searchTerm);
    });
  });

  for (const term of SearchProductData.validProductNames) {
    test(`should return matching results when searching for "${term}" @regression`, async ({
      homePage,
      productsPage,
    }) => {
      await homePage.open();
      await homePage.verifyHomePageIsVisible();
      await homePage.clickProducts();
      await productsPage.verifyAllProductsPageIsLoaded();

      await productsPage.searchProduct(term);

      await productsPage.verifySearchedProductsHeadingVisible();
      const count = await productsPage.getSearchedProductCount();
      expect(count, `At least one product should match "${term}"`).toBeGreaterThan(0);
      await productsPage.verifySearchResultsContainTerm(term);
    });
  }
});
