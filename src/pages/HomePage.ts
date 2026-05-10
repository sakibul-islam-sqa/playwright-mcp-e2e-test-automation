import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { URLS } from '../config/urls';
import { logger } from '../utils/logger';

/**
 * Page object for the Automation Exercise home page.
 * Encapsulates the main navigation, slider verification, category sidebar
 * (used on certain landing variants), and "View Product" entry points.
 */
export class HomePage extends BasePage {
  readonly logo: Locator;
  readonly homeNavLink: Locator;
  readonly productsNavLink: Locator;
  readonly cartNavLink: Locator;
  readonly signupLoginNavLink: Locator;
  readonly testCasesNavLink: Locator;
  readonly apiTestingNavLink: Locator;
  readonly contactUsNavLink: Locator;

  readonly slider: Locator;
  readonly featuresItems: Locator;
  readonly featuresItemsHeading: Locator;

  readonly categorySidebar: Locator;
  readonly womenCategory: Locator;
  readonly menCategory: Locator;
  readonly kidsCategory: Locator;
  readonly brandsSidebar: Locator;

  readonly viewProductLinks: Locator;
  readonly addToCartButtons: Locator;
  readonly productCards: Locator;

  readonly subscriptionHeading: Locator;
  readonly footer: Locator;

  constructor(page: Page) {
    super(page, 'HomePage');

    this.logo = page.locator('div.logo a img[alt="Website for automation practice"]');
    this.homeNavLink = page.locator('a[href="/"]').first();
    this.productsNavLink = page.locator('a[href="/products"]').first();
    this.cartNavLink = page.locator('a[href="/view_cart"]').first();
    this.signupLoginNavLink = page.locator('a[href="/login"]').first();
    this.testCasesNavLink = page.locator('a[href="/test_cases"]').first();
    this.apiTestingNavLink = page.locator('a[href="/api_list"]').first();
    this.contactUsNavLink = page.locator('a[href="/contact_us"]').first();

    this.slider = page.locator('#slider');
    this.featuresItems = page.locator('.features_items');
    this.featuresItemsHeading = page.locator('.features_items h2.title');

    this.categorySidebar = page.locator('.left-sidebar').locator('.category-products');
    this.womenCategory = page.locator('a[href="#Women"]');
    this.menCategory = page.locator('a[href="#Men"]');
    this.kidsCategory = page.locator('a[href="#Kids"]');
    this.brandsSidebar = page.locator('.brands_products');

    this.viewProductLinks = page.locator('a:has-text("View Product")');
    this.addToCartButtons = page.locator(
      '.product-overlay .add-to-cart, .productinfo .add-to-cart',
    );
    this.productCards = page.locator('.features_items .product-image-wrapper');

    this.subscriptionHeading = page.locator('h2:has-text("Subscription")');
    this.footer = page.locator('#footer');
  }

  async open(): Promise<void> {
    logger.info('Opening home page');
    await this.navigate(URLS.HOME);
  }

  async verifyHomePageIsVisible(): Promise<void> {
    logger.step('Verifying home page is visible');
    await expect(this.page).toHaveTitle(/Automation Exercise/i);
    await this.assertElementVisible(this.logo, 'Site logo should be visible');
    await this.assertElementVisible(this.slider, 'Home slider should be visible');
    await this.assertElementVisible(this.featuresItems, 'Features items section should be visible');
  }

  async clickProducts(): Promise<void> {
    logger.step('Clicking on Products navigation link');
    await this.dismissOverlays();
    await this.safeClick(this.productsNavLink);
  }

  async clickCart(): Promise<void> {
    logger.step('Clicking on Cart navigation link');
    await this.dismissOverlays();
    await this.safeClick(this.cartNavLink);
  }

  async clickViewProductByIndex(index = 0): Promise<void> {
    logger.step(`Clicking 'View Product' for product at index ${index}`);
    await this.dismissOverlays();
    const link = this.viewProductLinks.nth(index);
    await this.waitForVisible(link);
    await this.safeClick(link);
  }

  async verifyCategoriesSidebarVisible(): Promise<void> {
    logger.step('Verifying categories sidebar is visible');
    await this.assertElementVisible(this.categorySidebar, 'Category sidebar should be visible');
    await this.assertElementVisible(this.womenCategory, 'Women category should be visible');
    await this.assertElementVisible(this.menCategory, 'Men category should be visible');
    await this.assertElementVisible(this.kidsCategory, 'Kids category should be visible');
  }

  async expandCategory(categoryName: 'Women' | 'Men' | 'Kids'): Promise<void> {
    logger.step(`Expanding category: ${categoryName}`);
    const categoryLink = this.page.locator(`a[href="#${categoryName}"]`);
    await this.safeClick(categoryLink);
  }

  async clickSubCategory(
    parentCategory: 'Women' | 'Men' | 'Kids',
    subCategory: string,
  ): Promise<void> {
    logger.step(`Clicking sub-category: ${parentCategory} > ${subCategory}`);
    const subCategoryLink = this.page
      .locator(`#${parentCategory}`)
      .locator(`a:has-text("${subCategory}")`);
    await this.waitForVisible(subCategoryLink);
    await this.safeClick(subCategoryLink);
  }

  async getProductCount(): Promise<number> {
    return this.productCards.count();
  }
}
