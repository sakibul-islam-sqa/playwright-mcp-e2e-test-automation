import { test, expect } from '../../src/fixtures';
import { CategoryData } from '../../src/data/test-data';

/**
 * Test Case 5: View Category Products
 *
 * Steps covered:
 *  1. Launch browser
 *  2. Navigate to http://automationexercise.com
 *  3. Verify that categories are visible on left side bar
 *  4. Click on 'Women' category
 *  5. Click on any category link under 'Women' category, for example: Tops
 *  6. Verify that category page is displayed and confirm text 'WOMEN - TOPS PRODUCTS'
 *  7. On left side bar, click on any sub-category link of 'Men' category
 *  8. Verify that user is navigated to that category page
 */
test.describe('TC5 - View Category Products @smoke @regression', () => {
  test('should browse Women > Tops then switch to Men > Tshirts', async ({
    homePage,
    categoryPage,
  }) => {
    await test.step('Launch browser and navigate to automationexercise.com', async () => {
      await homePage.open();
    });

    await test.step('Verify categories are visible on the left sidebar', async () => {
      await homePage.verifyCategoriesSidebarVisible();
    });

    await test.step("Expand the 'Women' category", async () => {
      await homePage.expandCategory('Women');
    });

    await test.step("Click on the 'Tops' sub-category", async () => {
      await homePage.clickSubCategory('Women', CategoryData.women.subCategories.tops);
    });

    await test.step("Verify the page shows 'WOMEN - TOPS PRODUCTS'", async () => {
      await categoryPage.verifyCategoryPageIsLoaded();
      await categoryPage.verifyCategoryHeadingText(CategoryData.women.expectedHeadingForTops);
      const productCount = await categoryPage.getProductCount();
      expect(productCount, 'Tops category should display at least one product').toBeGreaterThan(0);
    });

    await test.step("Expand the 'Men' category from sidebar", async () => {
      await homePage.expandCategory('Men');
    });

    await test.step("Click on the 'Tshirts' sub-category under Men", async () => {
      await homePage.clickSubCategory('Men', CategoryData.men.subCategories.tshirts);
    });

    await test.step('Verify navigation to Men > Tshirts category', async () => {
      await categoryPage.verifyCategoryPageIsLoaded();
      await categoryPage.verifyCategoryHeadingText(CategoryData.men.expectedHeadingForTshirts);
      const productCount = await categoryPage.getProductCount();
      expect(productCount, 'Men > Tshirts should display at least one product').toBeGreaterThan(0);
    });
  });

  test('should support browsing Women > Dress as an alternate flow @regression', async ({
    homePage,
    categoryPage,
  }) => {
    await homePage.open();
    await homePage.verifyCategoriesSidebarVisible();

    await homePage.expandCategory('Women');
    await homePage.clickSubCategory('Women', CategoryData.women.subCategories.dress);

    await categoryPage.verifyCategoryPageIsLoaded();
    await categoryPage.verifyCategoryHeadingText(CategoryData.women.expectedHeadingForDress);
  });
});
