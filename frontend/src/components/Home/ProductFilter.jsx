import React, { useMemo } from 'react'

const ProductFilter = ({ onCategoryChange, allProducts }) => {
  // Extract unique categories from all products
  const availableCategories = useMemo(() => {
    const categories = new Set();
    allProducts.forEach(product => {
      if (product.category) {
        categories.add(product.category);
      }
    });
    return Array.from(categories).sort();
  }, [allProducts]);

  // Category emoji mapping
  const getCategoryEmoji = (category) => {
    const emojiMap = {
      'beauty': '💄',
      'fragrances': '🌸',
      'furniture': '🪑',
      'groceries': '🛒',
      'home-decoration': '🏠',
      'kitchen-accessories': '🍳',
      'laptops': '💻',
      'mens-shirts': '👔',
      'mens-shoes': '👞',
      'mens-watches': '⌚',
      'mobile-accessories': '📱',
      'motorcycle': '🏍️',
      'skin-care': '🧴',
      'smartphones': '📱',
      'sports-accessories': '⚽',
      'sunglasses': '🕶️',
      'tablets': '📱',
      'tops': '👕',
      'vehicle': '🚗',
      'womens-bags': '👜',
      'womens-dresses': '👗',
      'womens-jewellery': '💍',
      'womens-shoes': '👠',
      'womens-watches': '⌚'
    };
    return emojiMap[category] || '📦';
  };

  return (
    <div className='product-filter'>
      <button
        className='product-filter-button-all'
        onClick={() => onCategoryChange('All')}
        aria-label="All categories"
      >
        All 🌎
      </button>
      {availableCategories.map(category => (
        <button
          key={category}
          className={`product-filter-button-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
          onClick={() => onCategoryChange(category)}
          aria-label={`${category} category`}
        >
          {category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ')} {getCategoryEmoji(category)}
        </button>
      ))}
    </div>
  )
}

export default ProductFilter