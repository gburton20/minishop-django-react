import { useMemo, useState, useRef } from 'react'

const ProductFilter = ({ onCategoryChange, allProducts, onFilterApplied }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const closeTimeoutRef = useRef(null);

  // Category emoji mapping for individual categories
  const emojiMap = {
    'beauty': '💄',
    'electronics': '🔌',
    'fragrances': '🌸',
    'furniture': '🪑',
    'groceries': '🛒',
    'home-decoration': '🏠',
    'kitchen-accessories': '🍳',
    'laptops': '💻',
    'mens-accessories': '🧢',
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

  // Hierarchical category structure
  const categoryHierarchy = {
    'All': {
      emoji: '🌎',
      subcategories: null
    },
    'Beauty': {
      emoji: '💄',
      subcategories: ['beauty', 'fragrances', 'skin-care']
    },
    'Men\'s Clothing': {
      emoji: '👔',
      subcategories: ['mens-accessories', 'mens-shirts', 'mens-shoes', 'mens-watches', 'sunglasses', 'tops']
    },
    'Electronics': {
      emoji: '🔌',
      subcategories: ['electronics', 'laptops', 'mobile-accessories', 'smartphones', 'tablets']
    },
    'Groceries': {
      emoji: '🛒',
      subcategories: null
    },
    'Home': {
      emoji: '🏠',
      subcategories: ['furniture', 'home-decoration', 'kitchen-accessories', 'sports-accessories']
    },
    'Transport': {
      emoji: '🚗',
      subcategories: ['motorcycle', 'vehicle']
    },
    'Women\'s Clothing': {
      emoji: '👗',
      subcategories: ['sunglasses', 'tops', 'womens-bags', 'womens-dresses', 'womens-jewellery', 'womens-shoes', 'womens-watches']
    }
  };

  // Extract available categories from products
  const availableCategories = useMemo(() => {
    const categories = new Set();
    allProducts.forEach(product => {
      if (product.category) {
        categories.add(product.category);
      }
    });
    return categories;
  }, [allProducts]);

  // Filter meta-categories to only show those with available products
  const availableMetaCategories = useMemo(() => {
    return Object.entries(categoryHierarchy).filter(([metaName, metaData]) => {
      if (metaName === 'All') return true;
      if (!metaData.subcategories) {
        // Standalone category (Groceries)
        return availableCategories.has(metaName.toLowerCase());
      }
      // Meta-category with subcategories
      return metaData.subcategories.some(subcat => availableCategories.has(subcat));
    });
  }, [availableCategories]);

  // Get emoji for a category
  const getCategoryEmoji = (category) => {
    return emojiMap[category] || '📦';
  };

  // Format category name for display
  const formatCategoryName = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
  };

  // Handle meta-category interaction
  const handleMetaCategoryClick = (metaName, metaData) => {
    if (metaName === 'All') {
      onCategoryChange('All');
      onFilterApplied?.('All');
      setExpandedCategory(null);
    } else if (!metaData.subcategories) {
      // Standalone category like Groceries
      onCategoryChange(metaName.toLowerCase());
      onFilterApplied?.(metaName);
      setExpandedCategory(null);
    } else {
      // Toggle expanded state for categories with subcategories
      setExpandedCategory(expandedCategory === metaName ? null : metaName);
    }
  };

  const handleMouseEnter = (metaName, metaData) => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    
    if (metaData.subcategories) {
      setExpandedCategory(metaName);
    }
  };

  const handleMouseLeave = () => {
    // Set a timeout to close the menu
    closeTimeoutRef.current = setTimeout(() => {
      setExpandedCategory(null);
    }, 200);
  };

  const keepMenuOpen = (metaName) => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setExpandedCategory(metaName);
  };
  
  const handleSubcategoryClick = (subcategory, subcategoryName) => {
    onCategoryChange(subcategory);
    onFilterApplied?.(subcategoryName);
    setExpandedCategory(null);
  };

  return (
    <div
      className='mx-auto w-full max-w-full flex flex-nowrap gap-2 overflow-x-auto overscroll-x-contain snap-x snap-mandatory px-4 [-webkit-overflow-scrolling:touch] pb-4
      
      lg:px-0 lg:justify-center'
    >
      {availableMetaCategories.map(([metaName, metaData]) => (
        <div
          key={metaName}
          className='product-filter-category-wrapper'
          onMouseEnter={() => handleMouseEnter(metaName, metaData)}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className={`product-filter-button-${metaName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
            onClick={() => handleMetaCategoryClick(metaName, metaData)}
            aria-label={`${metaName} category`}
            aria-expanded={expandedCategory === metaName}
          >
            {metaName} {metaData.emoji}
          </button>
          
          {metaData.subcategories && expandedCategory === metaName && (
            <div 
              className='product-filter-submenu'
              onMouseEnter={() => keepMenuOpen(metaName)}
              onMouseLeave={handleMouseLeave}
            >
              {metaData.subcategories
                .filter(subcat => availableCategories.has(subcat))
                .map(subcategory => (
                  <button
                    key={subcategory}
                    className={`product-filter-subbutton-${subcategory.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    onClick={() => handleSubcategoryClick(subcategory, formatCategoryName(subcategory))}
                    aria-label={`${formatCategoryName(subcategory)} category`}
                  >
                    {formatCategoryName(subcategory)} {getCategoryEmoji(subcategory)}
                  </button>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default ProductFilter