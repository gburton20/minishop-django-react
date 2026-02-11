import { useEffect, useState } from 'react';

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// Keeps rows full for your configured column counts:
// - base (<sm): 2 cols  -> 20 items (10 rows)
// - sm:         3 cols  -> 18 items (6 rows)
// - md:         4 cols  -> 20 items (5 rows)
// - lg:         5 cols  -> 20 items (4 rows)
// - xl:         6 cols  -> 18 items (3 rows)
// - 2xl:        6 cols  -> 18 items (3 rows)
const PER_PAGE_BY_BREAKPOINT = {
  base: 20,
  sm: 18,
  md: 20,
  lg: 20,
  xl: 18,
  '2xl': 18,
};

function getProductsPerPage() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return PER_PAGE_BY_BREAKPOINT.base;
  }

  const is2xl = window.matchMedia(`(min-width: ${BREAKPOINTS['2xl']}px)`).matches;
  if (is2xl) return PER_PAGE_BY_BREAKPOINT['2xl'];

  const isXl = window.matchMedia(`(min-width: ${BREAKPOINTS.xl}px)`).matches;
  if (isXl) return PER_PAGE_BY_BREAKPOINT.xl;

  const isLg = window.matchMedia(`(min-width: ${BREAKPOINTS.lg}px)`).matches;
  if (isLg) return PER_PAGE_BY_BREAKPOINT.lg;

  const isMd = window.matchMedia(`(min-width: ${BREAKPOINTS.md}px)`).matches;
  if (isMd) return PER_PAGE_BY_BREAKPOINT.md;

  const isSm = window.matchMedia(`(min-width: ${BREAKPOINTS.sm}px)`).matches;
  if (isSm) return PER_PAGE_BY_BREAKPOINT.sm;

  return PER_PAGE_BY_BREAKPOINT.base;
}

export default function useProductsPerPage() {
  const [productsPerPage, setProductsPerPage] = useState(getProductsPerPage);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQueries = [
      window.matchMedia(`(min-width: ${BREAKPOINTS.sm}px)`),
      window.matchMedia(`(min-width: ${BREAKPOINTS.md}px)`),
      window.matchMedia(`(min-width: ${BREAKPOINTS.lg}px)`),
      window.matchMedia(`(min-width: ${BREAKPOINTS.xl}px)`),
      window.matchMedia(`(min-width: ${BREAKPOINTS['2xl']}px)`),
    ];

    const handleChange = () => setProductsPerPage(getProductsPerPage());

    mediaQueries.forEach((mq) => mq.addEventListener('change', handleChange));
    handleChange();

    return () => {
      mediaQueries.forEach((mq) => mq.removeEventListener('change', handleChange));
    };
  }, []);

  return productsPerPage;
}
