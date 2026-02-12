import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

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

const ProductFilter = ({ onCategoryChange, allProducts, onFilterApplied }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const closeTimeoutRef = useRef(null);
  const triggerButtonRefs = useRef({});
  const submenuRef = useRef(null);
  const [submenuPosition, setSubmenuPosition] = useState(null);

  const availableCategories = useMemo(() => {
    const categories = new Set();
    allProducts.forEach(product => {
      if (product.category) {
        categories.add(product.category);
      }
    });
    return categories;
  }, [allProducts]);

  const availableMetaCategories = useMemo(() => {
    return Object.entries(categoryHierarchy).filter(([metaName, metaData]) => {
      if (metaName === 'All') return true;
      if (!metaData.subcategories) {
        return availableCategories.has(metaName.toLowerCase());
      }
      return metaData.subcategories.some(subcat => availableCategories.has(subcat));
    });
  }, [availableCategories]);

  const getCategoryEmoji = (category) => {
    return emojiMap[category] || '📦';
  };

  const formatCategoryName = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
  };

  const handleMetaCategoryClick = (metaName, metaData) => {
    if (metaName === 'All') {
      onCategoryChange('All');
      onFilterApplied?.('All');
      setExpandedCategory(null);
    } else if (!metaData.subcategories) {
      onCategoryChange(metaName.toLowerCase());
      onFilterApplied?.(metaName);
      setExpandedCategory(null);
    } else {
      const nextExpanded = expandedCategory === metaName ? null : metaName;
      setExpandedCategory(nextExpanded);
      if (nextExpanded) {
        queueMicrotask(() => updateSubmenuPosition(nextExpanded));
      }
    }
  };

  const updateSubmenuPosition = useCallback((metaName) => {
    const triggerEl = triggerButtonRefs.current?.[metaName];
    if (!triggerEl) return;

    const rect = triggerEl.getBoundingClientRect();
    const viewportPadding = 8;
    const desiredWidth = 240;
    const menuWidth = Math.max(
      180,
      Math.min(desiredWidth, window.innerWidth - viewportPadding * 2)
    );
    const triggerCenterX = rect.left + rect.width / 2;
    const minLeft = viewportPadding;
    const maxLeft = Math.max(viewportPadding, window.innerWidth - menuWidth - viewportPadding);
    const left = Math.min(Math.max(minLeft, triggerCenterX - menuWidth / 2), maxLeft);
    const top = rect.bottom + 8;

    setSubmenuPosition({
      top,
      left,
      width: menuWidth,
    });
  }, []);

  const handleMouseEnter = (metaName, metaData) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    
    if (metaData.subcategories) {
      setExpandedCategory(metaName);
      queueMicrotask(() => updateSubmenuPosition(metaName));
    }
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setExpandedCategory(null);
    }, 200);
  };

  const keepMenuOpen = (metaName) => {
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

  const expandedMetaData = useMemo(() => {
    if (!expandedCategory) return null;
    return categoryHierarchy[expandedCategory] ?? null;
  }, [expandedCategory]);

  useEffect(() => {
    if (!expandedCategory) return;
    if (!expandedMetaData?.subcategories) return;

    const onReposition = () => updateSubmenuPosition(expandedCategory);

    window.addEventListener('resize', onReposition);
    window.addEventListener('scroll', onReposition, true);

    return () => {
      window.removeEventListener('resize', onReposition);
      window.removeEventListener('scroll', onReposition, true);
    };
  }, [expandedCategory, expandedMetaData?.subcategories, updateSubmenuPosition]);

  useEffect(() => {
    if (!expandedCategory) return;
    if (!expandedMetaData?.subcategories) return;

    const onPointerDown = (event) => {
      const target = event.target;
      if (!(target instanceof Node)) return;

      const triggerEl = triggerButtonRefs.current?.[expandedCategory];
      if (submenuRef.current?.contains(target)) return;
      if (triggerEl?.contains(target)) return;

      setExpandedCategory(null);
    };

    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('touchstart', onPointerDown);

    return () => {
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('touchstart', onPointerDown);
    };
  }, [expandedCategory, expandedMetaData?.subcategories]);

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
            ref={(el) => {
              if (el) triggerButtonRefs.current[metaName] = el;
            }}
            className='w-full flex items-center justify-center gap-1 bg-transparent border-0 border-black p-0 text-inherit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#05abf3] focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-md'
            onClick={() => handleMetaCategoryClick(metaName, metaData)}
            aria-label={`${metaName} category`}
            aria-expanded={expandedCategory === metaName}
            aria-haspopup={metaData.subcategories ? 'menu' : undefined}
          >
            {metaName} {metaData.emoji}
          </button>
        </div>
      ))}

      {expandedCategory && expandedMetaData?.subcategories && submenuPosition &&
        createPortal(
          <div
            ref={submenuRef}
            role='menu'
            aria-label={`${expandedCategory} subcategories`}
            className='fixed z-2147483647 rounded-lg bg-white text-slate-900 shadow-lg ring-1 ring-black/10 p-2 flex flex-col gap-1'
            style={{
              top: `${submenuPosition.top}px`,
              left: `${submenuPosition.left}px`,
              width: `${submenuPosition.width}px`,
            }}
            onMouseEnter={() => keepMenuOpen(expandedCategory)}
            onMouseLeave={handleMouseLeave}
          >
            {expandedMetaData.subcategories
              .filter((subcat) => availableCategories.has(subcat))
              .map((subcategory) => (
                <button
                  key={subcategory}
                  role='menuitem'
                  className='w-full rounded-md bg-transparent border-0 px-3 py-2 text-left text-[14px] text-slate-800 hover:bg-slate-100 active:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#05abf3] focus-visible:ring-offset-2 lg:hover:bg-[linear-gradient(135deg,#d4bb4f_0%,#5f8f3b_100%)] lg:hover:text-white'
                  onClick={() => handleSubcategoryClick(subcategory, formatCategoryName(subcategory))}
                  aria-label={`${formatCategoryName(subcategory)} category`}
                >
                  {formatCategoryName(subcategory)} {getCategoryEmoji(subcategory)}
                </button>
              ))}
          </div>,
          document.body
        )}
    </div>
  )
}

export default ProductFilter