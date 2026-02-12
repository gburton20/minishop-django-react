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
import useProductsPerPage from '../../hooks/useProductsPerPage';

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
  const productsPerPage = useProductsPerPage();

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
        
        while (url) {
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            
            if (data.results) {
              allCustomProducts = [...allCustomProducts, ...data.results];
            } else if (Array.isArray(data)) {
              allCustomProducts = [...allCustomProducts, ...data];
              break;
            }
            
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
        ? product.image  
        : product.image 
          ? `${import.meta.env.VITE_API_URL}${product.image}`
          : '',      
      name: product.name,
      price: product.price,
      description: product.description || 'No description available',
      brand: product.brand || 'Unknown brand',
      rating: product.rating || null,
      discountPercentage: Number(product.discountPercentage ?? product.discount_percentage ?? 0),
      availabilityStatus: product.availabilityStatus ?? product.availability_status ?? 'In Stock',
      categoryObj: null
    }))
  ];

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
  
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, productsPerPage]);
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
  
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, productsPerPage]);
  
  // END of pagination logic

  return (
    <div className='flex flex-col'>
      
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
        
        {selectedCategory === 'All' && !searchQuery.trim() && <BannerAdContainer openProductModal={openProductModal} />}

        <div ref={productsInfoRef} className="text-center my-4 mx-0 text-[#666] text-[14px]">
          Showing {paginatedProducts.length} of {totalProducts} products {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
        </div>

        <ProductCardsList
          products={paginatedProducts}
          handleAddToCart={handleAddToCart}
          openProductModal={openProductModal}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
        />
        
        {(selectedCategory !== 'All' || searchQuery.trim()) && <BannerAdContainer openProductModal={openProductModal} />}
    </div>
  )
}

export default Home