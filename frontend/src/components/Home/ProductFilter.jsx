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
      
      lg:px-4 lg:justify-between'
    >
      {availableMetaCategories.map(([metaName, metaData]) => (
        <div
          key={metaName}
          className='relative inline-block p-1 bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] text-white border-2 border-solid border-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] rounded-lg p-[0.5rem 1rem] text-[14px] cursor-pointer transition-[all_0.2s_ease] whitespace-nowrap 
          
          lg:hover:[bg-#f5f5f5] lg:hover:border-[#999] lg:hover:transform-[translateY(-2px)] lg:hover:shadow-[0 2px 8px rgba(0, 0, 0, 0.1)] lg:active:transform-[translateY(0)]
          
          '
          onMouseEnter={() => handleMouseEnter(metaName, metaData)}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className='w-full flex items-center justify-center gap-1 bg-transparent border-0 border-black p-0 text-inherit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#05abf3] focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-md '
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
                    className='w-full bg-transparent border-0 p-0 text-left'
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