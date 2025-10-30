import { useContext, useEffect, useState, useMemo } from 'react'
import ProductFilter from './ProductFilter'
import SellProductForm from './SellProductForm'
import BannerAdContainer from './BannerAdContainer'
import ProductCardsList from './ProductCardsList/ProductCardsList'
import SellProductButton from './SellProductButton'
import Pagination from './Pagination'
import { useAuth0 } from "@auth0/auth0-react";
import CartContext from '../../context/CartContext'
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, setSelectedCategory, setProducts } from '../../features/productsFiltersSlice';

const Home = ({
  handleAddToCart = useContext(CartContext)}) => {

  // START of state section:

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [customProducts, setCustomProducts] = useState([]);

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
        const response = await fetch('http://localhost:8000/products/');
        if (response.ok) {
          const data = await response.json();
          setCustomProducts(data.results || data); // handle paginated or non-paginated response
        }
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
      id: product.id,
      image: product.images && product.images.length > 0 ? product.images[0] : '',
      name: product.title,
      price: product.price,
      description: product.description || '',
      categoryObj: null 
    })),
    ...customProducts.map(product => ({
      category: product.category,
      id: product.id ? `custom-${product.id}` : `custom-fallback-${product.idx}`,
      image: product.image
      ? `http://localhost:8000${product.image}`
      : '',      
      name: product.name,
      price: product.price,
      description: product.description || '',
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
  
  // Calculate the products to display on current page
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, productsPerPage]);
  
  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Optional: scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);
  
  // END of pagination logic

  return (
    <div className='home'>
      <ProductFilter
        onCategoryChange={handleCategoryChange}
        allProducts={allProducts}
      />
        {isAuthenticated && <SellProductButton onClick={openForm}/>}
        {isFormOpen && <SellProductForm 
          handleAddProduct={handleAddProduct}
          closeForm={closeForm} 
          isFormOpen={isFormOpen}
          setCustomProducts={setCustomProducts}
        />}
        <BannerAdContainer/>

        {/* Products count info */}
        <div className="products-info">
          Showing {paginatedProducts.length} of {totalProducts} products {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
        </div>

        <ProductCardsList
          products={paginatedProducts}
          handleAddToCart={handleAddToCart}
        />

        {/* Pagination component */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
        />
    </div>
  )
}

export default Home