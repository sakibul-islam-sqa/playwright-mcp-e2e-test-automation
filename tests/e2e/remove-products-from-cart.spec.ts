import { test } from '../../src/fixtures';

/**
 * Test Case 4: Remove Products From Cart
 *
 * Steps covered:
 *  1. Launch browser
 *  2. Navigate to http://automationexercise.com
 *  3. Verify that home page is visible successfully
 *  4. Add products to cart
 *  5. Click 'Cart' button
 *  6. Verify that cart page is displayed
 *  7. Click 'X' button corresponding to particular product
 *  8. Verify that product is removed from the cart
 */
test.describe('TC4 - Remove Products From Cart @smoke @regression', () => {
  test('should remove a product from the cart and verify removal', async ({
    homePage,
    productsPage,
    cartPage,
  }) => {
    await test.step('Launch browser and navigate to automationexercise.com', async () => {
      await homePage.open();
    });

    await test.step('Verify that home page is visible successfully', async () => {
      await homePage.verifyHomePageIsVisible();
    });

    await test.step('Navigate to Products and add the first product to cart', async () => {
      await homePage.clickProducts();
      await productsPage.verifyAllProductsPageIsLoaded();
      await productsPage.addProductToCartByIndex(0);
      await productsPage.clickContinueShopping();
    });

    const secondProductName = await productsPage.getProductNameByIndex(1);

    await test.step('Add a second product to the cart', async () => {
      await productsPage.addProductToCartByIndex(1);
      await productsPage.clickContinueShopping();
    });

    await test.step('Click Cart button in the navigation bar', async () => {
      await homePage.clickCart();
    });

    await test.step('Verify that cart page is displayed', async () => {
      await cartPage.verifyCartPageIsLoaded();
      await cartPage.verifyCartHasItemsCount(2);
    });

    await test.step(`Remove the product "${secondProductName}" from cart`, async () => {
      await cartPage.removeProductByName(secondProductName);
    });

    await test.step('Verify the product is no longer in the cart', async () => {
      await cartPage.verifyProductRemovedFromCart(secondProductName);
      await cartPage.verifyCartHasItemsCount(1);
    });
  });
});
