import { createContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // State for selected image in SellProductForm
  const [selectedImage, setSelectedImage] = useState(null);

  const [cartState, setCartState] = useState(() => {
    const saved = localStorage.getItem('Cart');
    if (saved === null) {
      localStorage.setItem('Cart', JSON.stringify([]));
    }
    return saved ? JSON.parse(saved) : [];
  });
  // Compute unique, sorted cart items for display
  const uniqueSortedCartItems = Array.from(
    new Map(cartState.map(product => [product.name, product]))
      .values()
  ).sort((a, b) => a.name.localeCompare(b.name));
  


  useEffect(() => {
    localStorage.setItem('Cart', JSON.stringify(cartState));
  }, [cartState]);

  const handleAddToCart = (product, showToastNotification = true) => {
    setCartState(prevCartState => {
      const newCartState = [...prevCartState, product];
      const count = newCartState.filter(p => p.name === product.name).length;
      // Show toast notification with count
      if (showToastNotification) {
        if (count > 1) {
          setToastMessage(`x${count} ${product.name} added to cart!`);
        } else {
          setToastMessage(`${product.name} added to cart!`);
        }
        setShowToast(true);
      }
      return newCartState;
    });
  };

  const closeToast = () => {
    setShowToast(false);
  };

  const handleRemoveFromCart = (productToRemove) => {
    setCartState(prevCartState => {
      const indexOfProductToRemove = prevCartState.findIndex(product => product.name === productToRemove.name);
      if (indexOfProductToRemove !== -1) {
        return [
          ...prevCartState.slice(0, indexOfProductToRemove),
          ...prevCartState.slice(indexOfProductToRemove + 1)
        ];
      }
      return prevCartState;
    });
  };

  const handleRemoveAllQtyOfProductsFromCartItem = (productToRemove) => {
    setCartState(prevCartState => prevCartState.filter(product => product.name !== productToRemove.name));
  };

  const counts = cartState.reduce((acc, product) => {
    acc[product.name] = (acc[product.name] || 0) + 1;
    return acc;
  }, {});

  const sumOfCartItems = cartState.reduce((acc, product) => acc + Number(product.price), 0);

  const numOfProductsInCart = cartState.length;

  useEffect(() => {
  }, [cartState]);

  return (
    <CartContext.Provider
      value={{
        navCartAddCount: cartState.length,
        cartState,
        cartItems: uniqueSortedCartItems,
        setCartState,
        handleAddToCart,
        handleRemoveFromCart,
        handleRemoveAllQtyOfProductsFromCartItem,
        counts,
        sumOfCartItems,
        numOfProductsInCart,
        toastMessage,
        showToast,
        closeToast,
        selectedImage,
        setSelectedImage
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;