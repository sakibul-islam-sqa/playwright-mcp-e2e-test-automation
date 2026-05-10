import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { URLS } from '../config/urls';
import { logger } from '../utils/logger';

/**
 * Page object for the All Products listing and search results page.
 * Encapsulates search behaviour and the hover-driven add-to-cart flow.
 */
export class ProductsPage extends BasePage {
  readonly allProductsHeading: Locator;
  readonly searchedProductsHeading: Locator;
  readonly searchInput: Locator;
  readonly searchSubmitButton: Locator;
  readonly productList: Locator;
  readonly productCards: Locator;
  readonly productInfoBlocks: Locator;
  readonly productOverlays: Locator;
  readonly continueShoppingButton: Locator;
  readonly viewCartLink: Locator;
  readonly cartModal: Locator;
  readonly cartModalTitle: Locator;
  readonly cartModalBody: Locator;

  constructor(page: Page) {
    super(page, 'ProductsPage');

    this.allProductsHeading = page.locator('h2.title:has-text("All Products")');
    this.searchedProductsHeading = page.locator('h2.title:has-text("Searched Products")');
    this.searchInput = page.locator('#search_product');
    this.searchSubmitButton = page.locator('#submit_search');
    this.productList = page.locator('.features_items');
    this.productCards = page.locator('.features_items .product-image-wrapper');
    this.productInfoBlocks = page.locator('.features_items .productinfo');
    this.productOverlays = page.locator('.product-overlay');
    this.continueShoppingButton = page.locator('button.close-modal:has-text("Continue Shopping")');
    this.viewCartLink = page.locator('#cartModal a[href="/view_cart"]');
    this.cartModal = page.locator('#cartModal');
    this.cartModalTitle = page.locator('#cartModal .modal-title');
    this.cartModalBody = page.locator('#cartModal .modal-body');
  }

  async open(): Promise<void> {
    logger.info('Opening All Products page directly');
    await this.navigate(URLS.PRODUCTS);
  }

  async verifyAllProductsPageIsLoaded(): Promise<void> {
    logger.step('Verifying ALL PRODUCTS page is loaded');
    await this.assertUrlContains('/products');
    await this.assertElementVisible(
      this.allProductsHeading,
      '"All Products" heading should be visible',
    );
  }

  async searchProduct(productName: string): Promise<void> {
    logger.step(`Searching for product: ${productName}`);
    await this.dismissOverlays();
    await this.fillField(this.searchInput, productName);
    await this.safeClick(this.searchSubmitButton);
    await this.waitForVisible(this.searchedProductsHeading);
  }

  async verifySearchedProductsHeadingVisible(): Promise<void> {
    logger.step('Verifying SEARCHED PRODUCTS heading is visible');
    await this.assertElementVisible(this.searchedProductsHeading);
  }

  async getSearchedProductCount(): Promise<number> {
    return this.productCards.count();
  }

  async verifySearchResultsContainTerm(searchTerm: string): Promise<void> {
    logger.step(`Verifying every visible result mentions "${searchTerm}"`);
    const count = await this.productCards.count();
    expect(count, 'At least one product should match the search').toBeGreaterThan(0);

    const productTexts = await this.productInfoBlocks.allTextContents();
    expect(productTexts.length, 'Product info blocks should be present').toBeGreaterThan(0);

    const term = searchTerm.toLowerCase();
    const allMatch = productTexts.every((text) => text.toLowerCase().includes(term));
    expect(allMatch, `All searched products should contain "${searchTerm}"`).toBeTruthy();
  }

  async verifyAllSearchedProductsAreVisible(): Promise<void> {
    logger.step('Verifying all searched products are visible');
    const count = await this.productCards.count();
    expect(count, 'At least one searched product should be displayed').toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await expect(this.productCards.nth(i)).toBeVisible();
    }
  }

  /**
   * Hovers over the product at `index` and clicks the overlay "Add to cart" button.
   * The home page and products page render two add-to-cart triggers per card
   * (one in the overlay, one in the static info block); the overlay variant
   * is the standard interaction path.
   */
  async addProductToCartByIndex(index: number): Promise<void> {
    logger.step(`Adding product at index ${index} to cart via hover`);
    await this.dismissOverlays();
    const productCard = this.productCards.nth(index);
    await productCard.scrollIntoViewIfNeeded();
    await productCard.hover();

    const overlayAddToCart = productCard.locator('.product-overlay .add-to-cart').first();
    await this.waitForVisible(overlayAddToCart);
    await this.safeClick(overlayAddToCart);
    await this.waitForVisible(this.cartModal);
  }

  async clickContinueShopping(): Promise<void> {
    logger.step('Clicking Continue Shopping in cart modal');
    await this.waitForVisible(this.continueShoppingButton);
    await this.safeClick(this.continueShoppingButton);
    await this.waitForHidden(this.cartModal);
  }

  async clickViewCartFromModal(): Promise<void> {
    logger.step('Clicking View Cart from cart modal');
    await this.waitForVisible(this.viewCartLink);
    await this.safeClick(this.viewCartLink);
  }

  async clickViewProductByIndex(index: number): Promise<void> {
    logger.step(`Clicking 'View Product' for product at index ${index}`);
    const viewProductLink = this.productCards.nth(index).locator('a:has-text("View Product")');
    await viewProductLink.scrollIntoViewIfNeeded();
    await this.safeClick(viewProductLink);
  }

  async getProductNameByIndex(index: number): Promise<string> {
    const product = this.productCards.nth(index);
    const name = await product.locator('.productinfo p').first().textContent();
    return (name ?? '').trim();
  }

  async getProductPriceByIndex(index: number): Promise<string> {
    const product = this.productCards.nth(index);
    const price = await product.locator('.productinfo h2').first().textContent();
    return (price ?? '').trim();
  }
}
