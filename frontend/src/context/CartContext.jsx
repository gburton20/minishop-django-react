import { createContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const [cartState, setCartState] = useState(() => {
    const saved = localStorage.getItem('Cart');
    if (saved === null) {
      localStorage.setItem('Cart', JSON.stringify([]));
    }
    return saved ? JSON.parse(saved) : [];
  });

  // Initialize navCartAddCount from localStorage cart length
  const [navCartAddCount, setNavCartAddCount] = useState(() => {
    const saved = localStorage.getItem('Cart');
    return saved ? JSON.parse(saved).length : 0;
  });

  useEffect(() => {
    localStorage.setItem('Cart', JSON.stringify(cartState));
  }, [cartState]);

  const handleAddToCart = (product) => {
    setCartState(prevCartState => {
      const newCartState = [...prevCartState, product];
      const count = newCartState.filter(p => p.name === product.name).length;
      
      // Show toast notification with count
      if (count > 1) {
        setToastMessage(`x${count} ${product.name} added to cart!`);
      } else {
        setToastMessage(`${product.name} added to cart!`);
      }
      setShowToast(true);
      
      return newCartState;
    });
    setNavCartAddCount(previousCount => previousCount + 1);
  };

  const closeToast = () => {
    setShowToast(false);
  };

  const handleRemoveFromCart = (productToRemove) => {
    setCartState(prevCartState => {
      const indexOfProductToRemove = prevCartState.findIndex(product => product.name === productToRemove.name);
      if (indexOfProductToRemove !== -1) {
        setNavCartAddCount(prevCount => Math.max(prevCount - 1, 0));
        return [
          ...prevCartState.slice(0, indexOfProductToRemove),
          ...prevCartState.slice(indexOfProductToRemove + 1)
        ];
      }
      return prevCartState;
    });
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
        navCartAddCount,
        cartState,
        setCartState,
        setNavCartAddCount,
        handleAddToCart,
        handleRemoveFromCart,
        counts,
        sumOfCartItems,
        numOfProductsInCart,
        toastMessage,
        showToast,
        closeToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;