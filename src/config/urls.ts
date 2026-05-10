/**
 * Centralized URL paths used across the application.
 * Keeping these in one place makes it easier to update routes
 * when the target application changes.
 */
export const URLS = {
  HOME: '/',
  PRODUCTS: '/products',
  CART: '/view_cart',
  LOGIN: '/login',
  SIGNUP: '/signup',
  CONTACT_US: '/contact_us',
  TEST_CASES: '/test_cases',
  API_TESTING: '/api_list',
  PRODUCT_DETAILS: (productId: number | string) => `/product_details/${productId}`,
  CATEGORY_PRODUCTS: (categoryId: number | string) => `/category_products/${categoryId}`,
  BRAND_PRODUCTS: (brandName: string) => `/brand_products/${brandName}`,
} as const;

export const PAGE_TITLES = {
  HOME: 'Automation Exercise',
  ALL_PRODUCTS: 'Automation Exercise - All Products',
  CART: 'Automation Exercise - Checkout',
  PRODUCT_DETAILS: 'Automation Exercise - Product Details',
} as const;
