import {useContext} from 'react'
import CartContext from '../../context/CartContext';


const CartItem = () => {
  const {
    cartItems,
    counts,
    handleAddToCart,
    handleRemoveFromCart,
    handleRemoveAllQtyOfProductsFromCartItem
  } = useContext(CartContext);

  if (!cartItems || cartItems.length === 0) {
    return null;
  }

  return (
    <>
      {cartItems.map((item, _) => (
          <div className='cart-item flex items-center border-2 mb-2 p-2 rounded-[10px] bg-white' key={item.name}>
            <img
              className='cart-item-image w-[60%] h-auto object-cover border-2 rounded-[10px] border-gray-500 bg-[linear-gradient(135deg,rgba(102,126,234,0.5)_0%,rgba(118,75,162,0.5)_100%)]'
              src={item.image || '/no-image-placeholder-image.svg'}
              alt={item.name || 'No product image found'}
            />
            <div className='cart-item-info-container-parent flex flex-col justify-center items-center w-[40%]'>
              <div className='cart-item-info-container-child flex flex-col justify-center items-center text-center w-full gap-4'>
                <div className='cart-item-name font-medium'>{item.name}</div>
                <div className='cart-item-price font-light'>${Number(item.price).toFixed(2)}</div>
                <div className='cart-item-qty-control-container flex justify-evenly m-1.25 p-1.25 w-[80%] border-2 rounded-[10px] border-gray-500 bg-[linear-gradient(135deg,#ead266_0%,#77a24b_100%)]'>
                  {/* The '-' button: */}
                  <button
                    className="cart-item-qty-'-' bg-white w-[25%] rounded-lg hover:bg-[#f5f5f5] hover:border-[#999] border-black"
                    onClick={() => {
                      handleRemoveFromCart(item);
                    }}>-</button>
                  <div className='cart-item-qty font-bold text-white'>{counts[item.name]}</div>
                  {/* The '+' button */}
                  <button 
                    className='cart-item-qty-+ bg-white w-[25%] rounded-lg hover:bg-[#f5f5f5] hover:border-[#999] border-black'
                    onClick={() => handleAddToCart(item)}
                  >
                    +
                  </button>
                </div>
                  <button
                    className='button-clear-all-instances-of-one-CartItem text-l text-white p-1 bg-gray-500 rounded-[10px] border-black border'
                    onClick={() => {
                      handleRemoveAllQtyOfProductsFromCartItem(item);
                    }}
                  >
                    Clear 🗑️
                  </button>
              </div>
            </div>
          </div>
        ))
      }
    </>
  )
}

export default CartItem
