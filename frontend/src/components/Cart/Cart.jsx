import {useContext} from 'react'
import CartContext from '../../context/CartContext';
import CartItem from './CartItem'
import { loadStripe } from '@stripe/stripe-js';
import { Link } from 'react-router-dom';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Cart = () => {
  const {
    setNavCartAddCount, 
    cartState, 
    setCartState, 
    numOfProductsInCart,
    counts,
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
      <div className=''>
        <div className='cart-section-parent-container flex flex-col border-2 border-gray-500 rounded-[10px] m-1 bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)]'>
          <div className='cart-section-qty-and-buttons-container flex flex-col items-stretch pt-2 pb-2 pl-1 pr-1'>
            <div className='flex flex-row justify-center'>
              <div className='cart-section-qty-summary bg-white rounded-[10px] border inline-block max-w-max mb-2'>
                <div className='font-normal'>You've added <strong>{numOfProductsInCart} items</strong> to your cart! 🛒</div>
              </div>
            </div>
            <div className='cart-section-buttons-container flex flex-row justify-around'>
                <Link to="/">
                  <button
                    className='button-continue-shopping text-l text-white p-1 bg-gray-500 rounded-[10px] border-white border'
                  >
                    Continue shopping 🛍️
                  </button>
                </Link>
                <button 
                  className='button-clear-cart-button text-l p-1 bg-gray-500 text-white rounded-[10px] sm:w-auto border-white border' 
                  onClick={() => {
                    setCartState([]);
                    setNavCartAddCount(0);
                  }}>
                    Clear entire cart 🗑️
                </button>
            </div>
          </div>
          {safeNumOfProductsInCart > 0 && (
            <div className='flex flex-col justify-evenly'>
              <div className='grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 ml-2.5 mr-2.5'>
                <CartItem/>
              </div>
              <div className='cart-section-total-and-checkout-button flex flex-col items-center border-2 m-2.5 p-2.5 rounded-[10px] bg-white'>
                <div className='bg-amber-200 mb-2.5'><strong>TOTAL: ${Number(sumOfCartItems).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></div>
                <button 
                  className='flex w-fit bg-[linear-gradient(135deg,#ead266_0%,#77a24b_100%)] text-white rounded-[10px] m-1.25 hover:bg-[#007bff] h-[10%] border-solid border-2 border-black px-4 py-2 items-center' 
                  onClick={handleRealStripeCheckout}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
            )}     
        </div>
      </div>
    </>
  )
}

export default Cart