import { useContext, useEffect, useState, useMemo, useRef } from 'react'
import ProductFilter from './ProductFilter'
import SellProductForm from './SellProductForm'
import BannerAdContainer from './BannerAdContainer'
import ProductCardsList from './ProductCardsList/ProductCardsList'
import SellProductButton from './SellProductButton'
import Pagination from './Pagination'
import ProductDetailsModal from '../ProductDetailsModal'
import { useAuth0 } from "@auth0/auth0-react";
import CartContext from '../../context/CartContext'
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, setSelectedCategory, setProducts, setSearchQuery } from '../../features/productsFiltersSlice';

const Home = ({
  handleAddToCart = useContext(CartContext)}) => {

  // START of state section:

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [customProducts, setCustomProducts] = useState([]);
  
  // Ref for scrolling to products info
  const productsInfoRef = useRef(null);

  // Product details modal state:
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Filter toast state:
  const [filterToast, setFilterToast] = useState({ show: false, message: '' });

  // Pagination state:
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(20);

  // END of state section

  // START of Redux section:
  const dispatch = useDispatch();
  const products = useSelector((state) => state.productsFilters.products);
  const selectedCategory = useSelector((state) => state.productsFilters.selectedCategory);
  const searchQuery = useSelector((state) => state.productsFilters.searchQuery);
  
  const setProductsLocal = (newProducts) => {
    dispatch(setProducts(newProducts));
  };

  const status = useSelector((state) => state.productsFilters.status);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  const handleCategoryChange = (category) => {
    dispatch(setSelectedCategory(category));
  };
  
  const handleFilterApplied = (categoryName) => {
    const message = categoryName === 'All' 
      ? 'Showing all products' 
      : `Filtered by: ${categoryName}`;
    setFilterToast({ show: true, message });
    
    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setFilterToast({ show: false, message: '' });
    }, 3000);
  };

  // END of Redux section

  // START of AUTH0 section:

  const { isAuthenticated } = useAuth0();
  
  // END OF AUTH0 section
  
  // START of logic for SellProductForm.jsx:
  
  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);
  
  const handleAddProduct = (newProduct) => {
    const newProductWithId = {
      ...newProduct,
      id: Date.now() + Math.random()
    };
    setProductsLocal([...products, newProductWithId]);
  }
  
  // END of logic for SellProductForm.jsx
  
  // START of logic for ProductDetailsModal:
  
  const openProductModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  
  const closeProductModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };
  
  // END of logic for ProductDetailsModal
  
  // START of logic for fetching products:

  // Fetch third-party products:
  useEffect(() => {
    const fetchThirdPartyProducts = async () => {
      const response = await fetch('https://dummyjson.com/products');
      const data = await response.json();
      setProductsLocal(data.products);
    };
    fetchThirdPartyProducts();
  }, []);
  
  // Fetch user-generated products from the Django backend:
  useEffect(() => {
    const fetchCustomProducts = async () => {
      try {
        let allCustomProducts = [];
        let url = `${import.meta.env.VITE_API_URL}/products/`;
        
        // Fetch all pages
        while (url) {
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            
            // Add products from current page
            if (data.results) {
              allCustomProducts = [...allCustomProducts, ...data.results];
            } else if (Array.isArray(data)) {
              // Handle case where response is direct array (no pagination)
              allCustomProducts = [...allCustomProducts, ...data];
              break;
            }
            
            // Get next page URL
            // DRF pagination typically returns an absolute `next` URL (e.g. http://127.0.0.1:8000/...).
            // On iPhone (ngrok https origin), following that absolute URL bypasses the Vite proxy and fails.
            // Convert to a same-origin relative URL so the request continues through the preview server proxy.
            if (data.next) {
              try {
                const nextUrl = new URL(data.next);
                url = `${nextUrl.pathname}${nextUrl.search}`;
              } catch {
                url = data.next;
              }
            } else {
              url = null;
            }
          } else {
            console.error('Error fetching custom products:', response.statusText);
            break;
          }
        }
        
        console.log(`Fetched ${allCustomProducts.length} custom products from Django API`);
        setCustomProducts(allCustomProducts);
      } catch (err) {
        console.error('Error fetching custom products:', err);
      }
    };
    fetchCustomProducts();
  }, []);
  // END of logic for fetching products
  
  // START of logic for merging 3rd-party-sourced and user-generated products:
  
  const allProducts = [
    ...products.map(product => ({
      category: product.category || null, 
      id: `third-party-${product.id}`,
      image: product.images && product.images.length > 0 ? product.images[0] : '',
      name: product.title,
      price: product.price,
      description: product.description || 'No description available',
      brand: product.brand || 'Unknown brand',
      rating: product.rating || null,
      discountPercentage: product.discountPercentage || 0,
      availabilityStatus: product.availabilityStatus || 'In Stock',
      categoryObj: null  
    })),
    ...customProducts.map(product => ({
      category: product.category,
      id: product.id ? `custom-${product.id}` : `custom-fallback-${product.idx}`,
      image: product.image && product.image.startsWith('http')
        ? product.image  // Already a full URL (Supabase or other external source)
        : product.image 
          ? `${import.meta.env.VITE_API_URL}${product.image}`  // Django local media path, where import.meta.env.VITE_API_URL = "http://localhost:8000"
          : '',      
      name: product.name,
      price: product.price,
      description: product.description || 'No description available',
      brand: product.brand || 'Unknown brand',
      rating: product.rating || null,
      // Django/DB uses snake_case (e.g. discount_percentage) while 3rd-party API uses camelCase.
      // Normalize here so downstream UI can always use `discountPercentage`.
      discountPercentage: Number(product.discountPercentage ?? product.discount_percentage ?? 0),
      availabilityStatus: product.availabilityStatus ?? product.availability_status ?? 'In Stock',
      categoryObj: null
    }))
  ];

  // console.log('typeof products', typeof(products))
  // console.log('allProducts', allProducts)

  // END of logic for merging 3rd-party-sourced and user-generated products
  
  // START of logic for filtering products:

  const filteredProducts = useMemo(() => {
    
    let filtered = selectedCategory === 'All' 
      ? allProducts 
      : allProducts.filter(product => product.category === selectedCategory);
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      
      filtered = filtered.filter(product => {
        const description = product.description?.toLowerCase() || '';
        const name = product.name?.toLowerCase() || '';
        const category = product.category?.toLowerCase() || '';
        
        const matches = (
          description.includes(query) ||
          name.includes(query) ||
          category.includes(query)
        );
        
        return matches;
      });
    }
    
    return filtered;
  }, [allProducts, selectedCategory, searchQuery]);

  // END of logic for filtering products
  
  // START of pagination logic:
  
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  
  // Calculate the products to display on current page
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, productsPerPage]);
  
  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to products info div when page changes
    productsInfoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      productsInfoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      productsInfoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);
  
  // END of pagination logic

  return (
    <div className='flex flex-col'>
      
      {/* Search toast notification - positioned at top, below navbar/search */}
      {searchQuery.trim() && (
        <div className="bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] text-white px-7 py-3.5 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.2)] flex items-center gap-3 mx-4 my-4 font-medium max-w-112.5">
          <span className="text-xl shrink-0">🔍</span>
          <span className="flex-1 text-[15px] leading-[1.4]">Searching: "{searchQuery}"</span>
          <button
            onClick={() => {
              dispatch(setSearchQuery(''));
              dispatch(setSelectedCategory('All'));
            }}
            className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors cursor-pointer text-lg leading-none"
            aria-label="Clear search"
          >
            ✕
          </button>
        </div>
      )}
      
      <ProductFilter
        onCategoryChange={handleCategoryChange}
        onFilterApplied={handleFilterApplied}
        allProducts={allProducts}
      />
      
      {/* Filter toast notification - positioned below ProductFilter */}
      {filterToast.show && (
        <div className="bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] text-white px-7 py-3.5 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.2)] flex items-center gap-3 mx-4 my-4 font-medium max-w-112.5">
          <span className="text-xl shrink-0">🔍</span>
          <span className="flex-1 text-[15px] leading-[1.4]">{filterToast.message}</span>
          <button
            onClick={() => {
              setFilterToast({ show: false, message: '' });
              dispatch(setSelectedCategory('All'));
            }}
            className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors cursor-pointer text-lg leading-none"
            aria-label="Clear filter toast"
          >
            ✕
          </button>
        </div>
      )}
      
        {isAuthenticated && <SellProductButton onClick={openForm}/>}
        {isFormOpen && <SellProductForm 
          handleAddProduct={handleAddProduct}
          closeForm={closeForm} 
          isFormOpen={isFormOpen}
          setCustomProducts={setCustomProducts}
        />}
        {isModalOpen && <ProductDetailsModal 
          product={selectedProduct}
          closeModal={closeProductModal}
          isModalOpen={isModalOpen}
        />}
        
        {/* Show banner at top only when 'All' is selected AND no search is active */}
        {selectedCategory === 'All' && !searchQuery.trim() && <BannerAdContainer openProductModal={openProductModal} />}

        {/* Products count info */}
        <div ref={productsInfoRef} className="text-center my-4 mx-0 text-[#666] text-[14px]">
          Showing {paginatedProducts.length} of {totalProducts} products {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
        </div>

        <ProductCardsList
          products={paginatedProducts}
          handleAddToCart={handleAddToCart}
          openProductModal={openProductModal}
        />

        {/* Pagination component */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
        />
        
        {/* Show banner at bottom when a filter is applied OR search is active */}
        {(selectedCategory !== 'All' || searchQuery.trim()) && <BannerAdContainer openProductModal={openProductModal} />}
    </div>
  )
}

export default Home