/**
 * Centralized test data used across the E2E suite.
 * Keeping inputs in one place avoids magic strings inside test specs and
 * makes it easy to switch between datasets (smoke vs. regression, etc.).
 */

export const SearchProductData = {
  validProductNames: ['Top', 'Dress', 'Jeans', 'T-shirt'],
  defaultSearchTerm: 'Top',
} as const;

export const ProductData = {
  defaultQuantity: 4,
  expectedCartProductCount: 2,
} as const;

export const CategoryData = {
  women: {
    name: 'Women',
    subCategories: {
      dress: 'Dress',
      tops: 'Tops',
      saree: 'Saree',
    },
    expectedHeadingForTops: 'WOMEN - TOPS PRODUCTS',
    expectedHeadingForDress: 'WOMEN - DRESS PRODUCTS',
  },
  men: {
    name: 'Men',
    subCategories: {
      tshirts: 'Tshirts',
      jeans: 'Jeans',
    },
    expectedHeadingForTshirts: 'MEN - TSHIRTS PRODUCTS',
    expectedHeadingForJeans: 'MEN - JEANS PRODUCTS',
  },
  kids: {
    name: 'Kids',
    subCategories: {
      dress: 'Dress',
      topsShirts: 'Tops & Shirts',
    },
  },
} as const;

export const ExpectedTexts = {
  searchedProducts: 'SEARCHED PRODUCTS',
  allProducts: 'ALL PRODUCTS',
  shoppingCart: 'Shopping Cart',
  category: 'Category',
  brands: 'Brands',
} as const;

export const Timeouts = {
  short: 5_000,
  medium: 15_000,
  long: 30_000,
  navigation: 30_000,
} as const;
