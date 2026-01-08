import {useContext} from 'react'
import CartContext from '../../context/CartContext';
import CartItem from './CartItem'
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Cart = () => {
  const {
    setNavCartAddCount, 
    cartState, 
    setCartState, 
    numOfProductsInCart,
    counts,
    handleAddToCart,
    handleRemoveFromCart,
    sumOfCartItems
  } = useContext(CartContext);

  function getUniqueSortedCartProducts(cartState) {
    return Array.from(
      new Map(cartState.map(product => [product.name, product]))
      .values()
    ).sort((a, b) => a.name.localeCompare(b.name));
  }
  const uniqueSortedCartProducts = getUniqueSortedCartProducts(cartState);

  const safeNumOfProductsInCart = Number(numOfProductsInCart) || 0;

    // Replace the handleRealStripeCheckout function with this updated version:
  
  const handleRealStripeCheckout = async () => {
    try {
      console.log('Starting Stripe checkout...'); // Debug log
      
      // Create checkout session via your backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/create-checkout-session/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: uniqueSortedCartProducts.map(product => ({
            name: product.name,
            price: product.price,
            quantity: counts[product.name],
            description: product.description || '',
            image: product.image || ''
          }))
        }),
      });
  
      console.log('Response status:', response.status); // Debug log
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Backend error: ${response.status} - ${errorText}`);
      }
  
      const session = await response.json();
      console.log('Session created:', session); // Debug log
      
      if (!session.url) {
        throw new Error('No checkout URL received from backend');
      }
  
      // Redirect to Stripe Checkout using the provided URL
      window.location.href = session.url;
      
    } catch (error) {
      console.error('Checkout error:', error);
      alert(`Checkout failed: ${error.message}\n\nFalling back to demo mode.`);
      // Fallback to demo for now
      handleDemoCheckout();
    }
  };

  const handleDemoCheckout = () => {
    // Enhanced demo that shows cart contents
    const cartSummary = uniqueSortedCartProducts.map(product => 
      `${product.name} x${counts[product.name]} - $${(product.price * counts[product.name]).toFixed(2)}`
    ).join('\n');
    
    alert(`🛒 DEMO CHECKOUT\n\nItems:\n${cartSummary}\n\nTotal: $${Number(sumOfCartItems).toFixed(2)}\n\nThis would redirect to Stripe Checkout in a real application.`);
  };

  return (
    <>
      <div className='cart'>
        <div className='cart-container'>
          <div className='cart-title-and-clear-cart-button-container'>
            <div className='cart-title'>You've added <strong>{numOfProductsInCart} items</strong> to your cart! 🛒</div>
            <button className='clear-cart-button' onClick={() => {
              setCartState([]);
              setNavCartAddCount(0);
            }}>Clear cart</button>
          </div>
          {safeNumOfProductsInCart > 0 && (
            <div className='cart-product-and-summary-container'>
              <div className='cart-product-list'>
                <CartItem
                  cartItems={uniqueSortedCartProducts}
                  cartItemCounts={counts}
                  handleAddToCart={handleAddToCart}
                  handleRemoveFromCart={handleRemoveFromCart}
                />
              </div>
              <div className='cart-order-summary-container'>
                <div className='cart-order-summary-breakdown'>
                  <div className='cart-order-total-container'>
                    <div className='cart-order-total-value'><strong>TOTAL: ${Number(sumOfCartItems).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></div>
                    <button 
                      className='cart-proceed-to-checkout-button' 
                      onClick={handleRealStripeCheckout}
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
            )}     
        </div>
      </div>
    </>
  )
}

export default Cart