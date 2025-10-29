import { useContext, useEffect, useState, useMemo } from 'react' // Add useMemo
import ProductFilter from './ProductFilter'
import SellProductForm from './SellProductForm'
import BannerAdContainer from './BannerAdContainer'
import ProductCardsList from './ProductCardsList/ProductCardsList'
import SellProductButton from './SellProductButton'
import { useAuth0 } from "@auth0/auth0-react";
import CartContext from '../../context/CartContext'
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, setSelectedCategory, setProducts } from '../../features/productsFiltersSlice';

const Home = ({
  handleAddToCart = useContext(CartContext)}) => {

  // START of state section:

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [customProducts, setCustomProducts] = useState([]);

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
      const response = await fetch('https://api.escuelajs.co/api/v1/products');
      const fetchedProducts = await response.json();
      setProductsLocal(fetchedProducts);
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
      category: product.category ? product.category.name : null,
      id: product.id,
      image: product.images && product.images.length > 0 ? product.images[0] : '',
      name: product.title,
      price: product.price,
      description: product.description || '',
      categoryObj: product.category
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

  // Use useMemo to apply filtering and search
  const filteredProducts = useMemo(() => {
    console.log('Filtering with searchQuery:', searchQuery); // Debug log
    
    // Apply category filter first
    let filtered = selectedCategory === 'All' 
      ? allProducts 
      : allProducts.filter(product => product.category === selectedCategory);
    
    // Apply search filter if there's a search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      
      filtered = filtered.filter(product => {
        const description = product.description?.toLowerCase() || '';
        const name = product.name?.toLowerCase() || '';
        const category = product.category?.toLowerCase() || '';
        
        let categoryCreationAt = '';
        let categoryUpdatedAt = '';
        
        if (product.categoryObj) {
          categoryCreationAt = product.categoryObj.creationAt?.toLowerCase() || '';
          categoryUpdatedAt = product.categoryObj.updatedAt?.toLowerCase() || '';
        }
        
        const matches = (
          description.includes(query) ||
          categoryCreationAt.includes(query) ||
          categoryUpdatedAt.includes(query) ||
          name.includes(query) ||
          category.includes(query)
        );
        
        if (matches) {
          console.log('Product matched search:', product.name); // Debug log
        }
        
        return matches;
      });
    }
    
    console.log('Filtered products count:', filtered.length); // Debug log
    return filtered;
  }, [allProducts, selectedCategory, searchQuery]);

  // END of logic for filtering products

  return (
    <div className='home'>
      <ProductFilter
        onCategoryChange={handleCategoryChange}
      />
        {isAuthenticated && <SellProductButton onClick={openForm}/>}
        {isFormOpen && <SellProductForm 
          handleAddProduct={handleAddProduct}
          closeForm={closeForm} 
          isFormOpen={isFormOpen}
          setCustomProducts={setCustomProducts}
        />}
        <BannerAdContainer/>
        <ProductCardsList
          products={filteredProducts}
          handleAddToCart={handleAddToCart}
        />
    </div>
  )
}

export default Home