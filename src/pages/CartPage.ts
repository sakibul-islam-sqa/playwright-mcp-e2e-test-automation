import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { URLS } from '../config/urls';
import { logger } from '../utils/logger';
import { parsePrice } from '../utils/helpers';

export interface CartItem {
  name: string;
  price: string;
  quantity: string;
  total: string;
  numericPrice: number;
  numericQuantity: number;
  numericTotal: number;
}

/**
 * Page object for the shopping cart page.
 * Provides high-level helpers for asserting line items, totals, and removals.
 */
export class CartPage extends BasePage {
  readonly cartInfoTable: Locator;
  readonly cartItems: Locator;
  readonly emptyCartMessage: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly breadcrumbShoppingCart: Locator;

  constructor(page: Page) {
    super(page, 'CartPage');

    this.cartInfoTable = page.locator('#cart_info_table');
    this.cartItems = page.locator('tbody tr[id^="product-"]');
    this.emptyCartMessage = page.locator('#empty_cart');
    this.proceedToCheckoutButton = page.locator('a.check_out, .btn.btn-default.check_out');
    this.breadcrumbShoppingCart = page.locator('.breadcrumb li.active:has-text("Shopping Cart")');
  }

  async open(): Promise<void> {
    logger.info('Opening cart page directly');
    await this.navigate(URLS.CART);
  }

  async verifyCartPageIsLoaded(): Promise<void> {
    logger.step('Verifying cart page is loaded');
    await this.assertUrlContains('/view_cart');
    await this.assertElementVisible(
      this.breadcrumbShoppingCart,
      'Shopping Cart breadcrumb should be visible',
    );
  }

  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async verifyCartHasItemsCount(expectedCount: number): Promise<void> {
    logger.step(`Verifying cart contains ${expectedCount} item(s)`);
    await expect(this.cartItems).toHaveCount(expectedCount);
  }

  async getCartItem(index: number): Promise<CartItem> {
    const row = this.cartItems.nth(index);
    const name = (await row.locator('.cart_description h4 a').textContent())?.trim() ?? '';

    // Scope to cells — avoids stray matches; `.first()` on price avoids extra `<p>` lines.
    const price = (await row.locator('td.cart_price p').first().textContent())?.trim() ?? '';

    const qtyCell = row.locator('td.cart_quantity');
    let quantity = '';
    const qtyInput = qtyCell.locator('input.cart_quantity_input, input[type="number"]');
    if ((await qtyInput.count()) > 0) {
      quantity = (await qtyInput.first().inputValue()).trim();
    } else {
      const disabledBtn = qtyCell.locator('button.disabled');
      if ((await disabledBtn.count()) > 0) {
        quantity = (await disabledBtn.first().textContent())?.trim() ?? '';
      } else {
        quantity =
          (
            await qtyCell
              .locator('button')
              .filter({ hasText: /^\s*\d+\s*$/ })
              .first()
              .textContent()
          )?.trim() ?? '';
      }
    }

    const total =
      (await row.locator('td.cart_total .cart_total_price').first().textContent())?.trim() ?? '';

    return {
      name,
      price,
      quantity,
      total,
      numericPrice: parsePrice(price),
      numericQuantity: parseInt(quantity, 10) || 0,
      numericTotal: parsePrice(total),
    };
  }

  async getAllCartItems(): Promise<CartItem[]> {
    const count = await this.getCartItemCount();
    const items: CartItem[] = [];
    for (let i = 0; i < count; i++) {
      items.push(await this.getCartItem(i));
    }
    return items;
  }

  async verifyProductInCartByName(productName: string): Promise<void> {
    logger.step(`Verifying product "${productName}" exists in cart`);
    const productLocator = this.cartItems.filter({
      has: this.page.locator(`.cart_description h4 a:has-text("${productName}")`),
    });
    await expect(productLocator).toHaveCount(1);
  }

  async verifyProductPriceQuantityAndTotal(index: number): Promise<void> {
    logger.step(`Validating price × quantity = total for cart row #${index}`);
    const item = await this.getCartItem(index);
    expect(item.numericPrice, `Row ${index} price should be parseable`).not.toBeNaN();
    expect(item.numericQuantity, `Row ${index} quantity should be > 0`).toBeGreaterThan(0);
    expect(item.numericTotal, `Row ${index} total should be parseable`).not.toBeNaN();
    expect(item.numericPrice * item.numericQuantity).toBeCloseTo(item.numericTotal, 5);
  }

  async verifyAllCartItemsTotals(): Promise<void> {
    const count = await this.getCartItemCount();
    for (let i = 0; i < count; i++) {
      await this.verifyProductPriceQuantityAndTotal(i);
    }
  }

  async verifyProductQuantity(productName: string, expectedQuantity: number): Promise<void> {
    logger.step(`Verifying product "${productName}" has quantity ${expectedQuantity}`);
    const items = await this.getAllCartItems();
    const item = items.find((cartItem) => cartItem.name === productName);
    expect(item, `Product "${productName}" should be present in cart`).toBeDefined();
    expect(item!.numericQuantity).toEqual(expectedQuantity);
  }

  async removeProductByIndex(index: number): Promise<void> {
    logger.step(`Removing product at row index ${index}`);
    const row = this.cartItems.nth(index);
    const removeButton = row.locator('.cart_quantity_delete');
    await removeButton.scrollIntoViewIfNeeded();
    await this.safeClick(removeButton);
  }

  async removeProductByName(productName: string): Promise<void> {
    logger.step(`Removing product "${productName}" from cart`);
    const row = this.cartItems.filter({
      has: this.page.locator(`.cart_description h4 a:has-text("${productName}")`),
    });
    await row.locator('.cart_quantity_delete').click();
  }

  async verifyProductRemovedFromCart(productName: string): Promise<void> {
    logger.step(`Verifying product "${productName}" was removed`);
    const row = this.cartItems.filter({
      has: this.page.locator(`.cart_description h4 a:has-text("${productName}")`),
    });
    await expect(row).toHaveCount(0);
  }

  async verifyCartIsEmpty(): Promise<void> {
    logger.step('Verifying cart is empty');
    await this.assertElementVisible(this.emptyCartMessage, 'Empty cart message should be visible');
  }
}
