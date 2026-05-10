import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '../utils/logger';

/**
 * Page object for category-filtered listing pages.
 * Verifies headings such as "WOMEN - TOPS PRODUCTS" and exposes
 * helpers for navigating between sub-categories on the sidebar.
 */
export class CategoryPage extends BasePage {
  readonly categoryHeading: Locator;
  readonly productsList: Locator;
  readonly productCards: Locator;
  readonly leftSidebar: Locator;

  constructor(page: Page) {
    super(page, 'CategoryPage');

    this.categoryHeading = page.locator('.features_items h2.title');
    this.productsList = page.locator('.features_items');
    this.productCards = page.locator('.features_items .product-image-wrapper');
    this.leftSidebar = page.locator('.left-sidebar');
  }

  async verifyCategoryPageIsLoaded(): Promise<void> {
    logger.step('Verifying category page is loaded');
    await this.assertUrlContains('/category_products/');
    await this.assertElementVisible(this.categoryHeading, 'Category heading should be visible');
    await this.assertElementVisible(this.productsList, 'Products list should be visible');
  }

  async verifyCategoryHeadingText(expectedHeading: string): Promise<void> {
    logger.step(`Verifying category heading equals "${expectedHeading}"`);
    await expect(this.categoryHeading).toContainText(expectedHeading);
  }

  async getCategoryHeading(): Promise<string> {
    return this.getText(this.categoryHeading);
  }

  async clickSubCategoryFromSidebar(
    parentCategory: 'Women' | 'Men' | 'Kids',
    subCategoryName: string,
  ): Promise<void> {
    logger.step(`Clicking sub-category "${subCategoryName}" under "${parentCategory}" on sidebar`);
    const parentLink = this.page.locator(`a[href="#${parentCategory}"]`);
    await parentLink.scrollIntoViewIfNeeded();
    await this.safeClick(parentLink);

    const subCategoryLink = this.page
      .locator(`#${parentCategory}`)
      .locator(`a:has-text("${subCategoryName}")`);
    await this.waitForVisible(subCategoryLink);
    await this.safeClick(subCategoryLink);
  }

  async getProductCount(): Promise<number> {
    return this.productCards.count();
  }
}
