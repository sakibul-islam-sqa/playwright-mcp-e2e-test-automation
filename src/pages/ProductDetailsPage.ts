import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '../utils/logger';

/**
 * Page object for the individual product details page.
 * Models product metadata, the quantity selector, and add-to-cart action.
 */
export class ProductDetailsPage extends BasePage {
  readonly productInformationSection: Locator;
  readonly productName: Locator;
  readonly productCategory: Locator;
  readonly productPrice: Locator;
  readonly productAvailability: Locator;
  readonly productCondition: Locator;
  readonly productBrand: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly cartModal: Locator;
  readonly viewCartLink: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page, 'ProductDetailsPage');

    this.productInformationSection = page.locator('.product-information');
    this.productName = page.locator('.product-information h2').first();
    this.productCategory = page.locator('.product-information p:has-text("Category:")');
    this.productPrice = page.locator('.product-information span span');
    this.productAvailability = page.locator('.product-information p:has-text("Availability:")');
    this.productCondition = page.locator('.product-information p:has-text("Condition:")');
    this.productBrand = page.locator('.product-information p:has-text("Brand:")');
    this.quantityInput = page.locator('#quantity');
    this.addToCartButton = page.locator('button.cart:has-text("Add to cart")');
    this.cartModal = page.locator('#cartModal');
    this.viewCartLink = page.locator('#cartModal a[href="/view_cart"]');
    this.continueShoppingButton = page.locator('button.close-modal:has-text("Continue Shopping")');
  }

  async verifyProductDetailsPageIsLoaded(): Promise<void> {
    logger.step('Verifying product details page is loaded');
    await this.assertUrlContains('/product_details/');
    await this.assertElementVisible(
      this.productInformationSection,
      'Product information section should be visible',
    );
    await this.assertElementVisible(this.productName);
    await this.assertElementVisible(this.productPrice);
    await this.assertElementVisible(this.quantityInput);
    await this.assertElementVisible(this.addToCartButton);
  }

  async getProductName(): Promise<string> {
    return this.getText(this.productName);
  }

  async setQuantity(quantity: number): Promise<void> {
    logger.step(`Setting product quantity to ${quantity}`);
    await this.quantityInput.click({ clickCount: 3 });
    await this.quantityInput.fill(String(quantity));
    await expect(this.quantityInput).toHaveValue(String(quantity));
  }

  async clickAddToCart(): Promise<void> {
    logger.step('Clicking Add to cart on product details page');
    await this.dismissOverlays();
    await this.safeClick(this.addToCartButton);
    await this.waitForVisible(this.cartModal);
  }

  async clickViewCart(): Promise<void> {
    logger.step('Clicking View Cart from confirmation modal');
    await this.waitForVisible(this.viewCartLink);
    await this.safeClick(this.viewCartLink);
  }

  async clickContinueShopping(): Promise<void> {
    logger.step('Clicking Continue Shopping from confirmation modal');
    await this.safeClick(this.continueShoppingButton);
    await this.waitForHidden(this.cartModal);
  }
}
