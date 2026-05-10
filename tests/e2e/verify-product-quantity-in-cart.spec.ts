import { test } from '../../src/fixtures';
import { ProductData } from '../../src/data/test-data';

/**
 * Test Case 3: Verify Product quantity in Cart
 *
 * Steps covered:
 *  1. Launch browser
 *  2. Navigate to http://automationexercise.com
 *  3. Verify that home page is visible successfully
 *  4. Click 'View Product' for any product on home page
 *  5. Verify product detail is opened
 *  6. Increase quantity to 4
 *  7. Click 'Add to cart' button
 *  8. Click 'View Cart' button
 *  9. Verify that product is displayed in cart page with exact quantity
 */
test.describe('TC3 - Verify Product Quantity in Cart @smoke @regression', () => {
  test('should add a product with custom quantity and verify it in cart', async ({
    homePage,
    productDetailsPage,
    cartPage,
  }) => {
    const desiredQuantity = ProductData.defaultQuantity;

    await test.step('Launch browser and navigate to automationexercise.com', async () => {
      await homePage.open();
    });

    await test.step('Verify that home page is visible successfully', async () => {
      await homePage.verifyHomePageIsVisible();
    });

    await test.step('Click View Product for the first product on home page', async () => {
      await homePage.clickViewProductByIndex(0);
    });

    await test.step('Verify product details page is opened', async () => {
      await productDetailsPage.verifyProductDetailsPageIsLoaded();
    });

    const productName = await productDetailsPage.getProductName();

    await test.step(`Increase quantity to ${desiredQuantity}`, async () => {
      await productDetailsPage.setQuantity(desiredQuantity);
    });

    await test.step('Click Add to cart', async () => {
      await productDetailsPage.clickAddToCart();
    });

    await test.step('Click View Cart in confirmation modal', async () => {
      await productDetailsPage.clickViewCart();
    });

    await test.step(`Verify product "${productName}" is in cart with quantity ${desiredQuantity}`, async () => {
      await cartPage.verifyCartPageIsLoaded();
      await cartPage.verifyProductInCartByName(productName);
      await cartPage.verifyProductQuantity(productName, desiredQuantity);
      await cartPage.verifyAllCartItemsTotals();
    });
  });
});
