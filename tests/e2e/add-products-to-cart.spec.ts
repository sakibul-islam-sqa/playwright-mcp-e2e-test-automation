import { test, expect } from '../../src/fixtures';
import { ProductData } from '../../src/data/test-data';

/**
 * Test Case 2: Add Products in Cart
 *
 * Steps covered:
 *  1. Launch browser
 *  2. Navigate to http://automationexercise.com
 *  3. Verify that home page is visible successfully
 *  4. Click 'Products' button
 *  5. Hover over first product and click 'Add to cart'
 *  6. Click 'Continue Shopping' button
 *  7. Hover over second product and click 'Add to cart'
 *  8. Click 'View Cart' button
 *  9. Verify both products are added to cart
 * 10. Verify their prices, quantity and total price
 */
test.describe('TC2 - Add Products in Cart @smoke @regression', () => {
  test('should add two products to the cart and verify totals', async ({
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

    await test.step('Click on the Products button', async () => {
      await homePage.clickProducts();
      await productsPage.verifyAllProductsPageIsLoaded();
    });

    const firstProductName = await productsPage.getProductNameByIndex(0);
    const firstProductPrice = await productsPage.getProductPriceByIndex(0);

    await test.step('Hover over first product and click Add to cart', async () => {
      await productsPage.addProductToCartByIndex(0);
    });

    await test.step('Click Continue Shopping in modal', async () => {
      await productsPage.clickContinueShopping();
    });

    const secondProductName = await productsPage.getProductNameByIndex(1);
    const secondProductPrice = await productsPage.getProductPriceByIndex(1);

    await test.step('Hover over second product and click Add to cart', async () => {
      await productsPage.addProductToCartByIndex(1);
    });

    await test.step('Click View Cart in modal', async () => {
      await productsPage.clickViewCartFromModal();
    });

    await test.step('Verify both products appear in cart', async () => {
      await cartPage.verifyCartPageIsLoaded();
      await cartPage.verifyCartHasItemsCount(ProductData.expectedCartProductCount);
      await cartPage.verifyProductInCartByName(firstProductName);
      await cartPage.verifyProductInCartByName(secondProductName);
    });

    await test.step('Verify prices, quantity and total for each line item', async () => {
      const items = await cartPage.getAllCartItems();
      expect(items).toHaveLength(ProductData.expectedCartProductCount);

      for (const item of items) {
        expect(item.numericPrice, `Price for ${item.name} should parse`).not.toBeNaN();
        expect(item.numericQuantity, `Quantity for ${item.name} should be > 0`).toBeGreaterThan(0);
        expect(item.numericTotal, `Total for ${item.name} should parse`).not.toBeNaN();
        expect(item.numericPrice * item.numericQuantity).toEqual(item.numericTotal);
      }

      const firstCartItem = items.find((item) => item.name === firstProductName);
      const secondCartItem = items.find((item) => item.name === secondProductName);

      expect(firstCartItem?.price).toContain(firstProductPrice.replace('Rs. ', ''));
      expect(secondCartItem?.price).toContain(secondProductPrice.replace('Rs. ', ''));
    });
  });
});
